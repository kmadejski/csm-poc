<?php

/**
 * @copyright Copyright (C) eZ Systems AS. All rights reserved.
 * @license For full copyright and license information view LICENSE file distributed with this source code.
 */
declare(strict_types=1);

namespace EzSystems\CSMBundle\Controller;

use eZ\Publish\API\Repository\ContentService;
use eZ\Publish\API\Repository\Exceptions\BadStateException;
use eZ\Publish\API\Repository\Exceptions\ContentFieldValidationException;
use eZ\Publish\API\Repository\Exceptions\ContentValidationException;
use eZ\Publish\API\Repository\Exceptions\InvalidArgumentException;
use eZ\Publish\API\Repository\Exceptions\NotFoundException;
use eZ\Publish\API\Repository\Exceptions\UnauthorizedException;
use eZ\Publish\API\Repository\SearchService;
use eZ\Publish\API\Repository\Values\Content\Query;
use EzSystems\EzPlatformAdminUiBundle\Controller\Controller;
use EzSystems\EzPlatformRichText\eZ\RichText\Converter;
use KMadejski\CSM\Value\VerseUpdateData;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;

final class VerseController extends Controller
{
    /**
     * @var \eZ\Publish\API\Repository\SearchService
     */
    private $searchService;

    /**
     * @var \eZ\Publish\API\Repository\ContentService
     */
    private $contentService;

    /**
     * @var \Symfony\Component\Serializer\SerializerInterface
     */
    private $serializer;

    /**
     * @var \EzSystems\EzPlatformRichText\eZ\RichText\Converter
     */
    private $docbookToXhtml5EditConverter;

    /**
     * @var string
     */
    private $verseContentTypeIdentifier;

    public function __construct(
        SearchService $searchService,
        ContentService $content,
        SerializerInterface $serializer,
        Converter $docbookToXhtml5EditConverter,
        string $verseContentTypeIdentifier
    ) {
        $this->searchService = $searchService;
        $this->verseContentTypeIdentifier = $verseContentTypeIdentifier;
        $this->contentService = $content;
        $this->serializer = $serializer;
        $this->docbookToXhtml5EditConverter = $docbookToXhtml5EditConverter;
    }

    public function showVersesAction(): Response
    {
        $result = $this->searchService->findContent($this->buildQuery());

        return $this->render(
            '@EzSystemsCSM/verse_list.html.twig',
            [
                'verses' => array_map(static function ($searchHit) {
                    return $searchHit->valueObject;
                }, $result->searchHits),
            ]
        );
    }

    public function updateVerseAction(Request $request): Response
    {
        /** @var VerseUpdateData $verseUpdateData */
        $verseUpdateData = $this->serializer->deserialize(
            $request->getContent(),
            VerseUpdateData::class,
            'json'
        );

        try {
            $content = $this->contentService->loadContent($verseUpdateData->getContentId());
            $contentInfo = $content->contentInfo;
            $contentDraft = $this->contentService->createContentDraft($contentInfo);

            $contentUpdateStruct = $this->contentService->newContentUpdateStruct();
            $contentUpdateStruct->setField($verseUpdateData->getFieldIdentifier(), $verseUpdateData->getContent());

            $contentDraft = $this->contentService->updateContent($contentDraft->versionInfo, $contentUpdateStruct);
            $content = $this->contentService->publishVersion($contentDraft->versionInfo);

            return new Response('', 200);
        } catch (NotFoundException $e) {
            return new Response($e->getMessage(), 404);
        } catch (UnauthorizedException $e) {
            return new Response($e->getMessage(), 401);
        } catch (BadStateException | ContentFieldValidationException | ContentValidationException | InvalidArgumentException $e) {
            // handle exception
        }
    }

    public function loadVerseFieldDataAction(int $contentId, string $fieldIdentifier): Response
    {
        try {
            $content = $this->contentService->loadContent($contentId);

            return new Response(
                $this->serializer->serialize(
                    ['value' => $this->docbookToXhtml5EditConverter->convert($content->getFieldValue($fieldIdentifier)->xml)->saveXML()],
                    'json'),
                200
            );
        } catch (NotFoundException $e) {
            return new Response($e->getMessage(), 404);
        } catch (UnauthorizedException $e) {
            return new Response($e->getMessage(), 500);
        }
    }

    private function buildQuery(): Query
    {
        $query = new Query();
        $query->query = new Query\Criterion\ContentTypeIdentifier($this->verseContentTypeIdentifier);

        return $query;
    }
}
