<?php
namespace TdsOnePager\Site\Eel\Helper;

use Neos\Flow\Annotations as Flow;
use Neos\Eel\ProtectedContextAwareInterface;

/**
 * Server request url helpers for Eel contexts
 *
 * @Flow\Proxy(false)
 */
class UrlHelper implements ProtectedContextAwareInterface
{
    /**
     * get ServerRequest URL parts from $_SERVER array
     *
     * Usage example for parameters:
     *
     * Url.server('HTTP_HOST') -> returns $SERVER['HTTP_HOST'] value
     *
     * @param string $name
     * @return string
     */
    public function server($name = ''): string
    {
        return array_key_exists($name, $_SERVER) ? $_SERVER[$name] : '';
    }

    /**
     * Get ServerRequest URL GET parameters
     *
     * Usage example for parameters:
     *
     * Url.parameters() -> returns all GET parameter names as array
     *
     * @return array
     */
    public function parameters(): array
    {
        return array_keys($_GET);
    }

    /**
     * Get specific ServerRequest URL GET parameter
     *
     * Usage example for paremeter:
     *
     * Url.parameter('name') -> returns value of GET parameter 'name'
     *
     * @param string $name
     * @return string
     */
    public function parameter($name = '')
    {
        return array_key_exists($name, $_GET) ? $_GET[$name] : '';
    }

    /**
     * All methods are considered safe
     *
     * @param string $methodName
     * @return boolean
     */
    public function allowsCallOfMethod($methodName)
    {
        return true;
    }
}
