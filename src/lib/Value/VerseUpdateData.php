<?php

/**
 * @copyright Copyright (C) eZ Systems AS. All rights reserved.
 * @license For full copyright and license information view LICENSE file distributed with this source code.
 */
declare(strict_types=1);

namespace EzSystems\CSM\Value;

final class VerseUpdateData
{
    /** @var int */
    private $contentId;

    /** @var string */
    private $fieldIdentifier;

    /** @var string */
    private $content;

    /**
     * @return int
     */
    public function getContentId(): int
    {
        return $this->contentId;
    }

    /**
     * @param int $contentId
     */
    public function setContentId(int $contentId): void
    {
        $this->contentId = $contentId;
    }

    /**
     * @return string
     */
    public function getFieldIdentifier(): string
    {
        return $this->fieldIdentifier;
    }

    /**
     * @param string $fieldIdentifier
     */
    public function setFieldIdentifier(string $fieldIdentifier): void
    {
        $this->fieldIdentifier = $fieldIdentifier;
    }

    /**
     * @return string
     */
    public function getContent(): string
    {
        return $this->content;
    }

    /**
     * @param string $content
     */
    public function setContent(string $content): void
    {
        $this->content = $content;
    }
}
