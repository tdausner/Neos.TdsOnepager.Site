<?php

namespace TdsOnepager\Site\Controller;

use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Flow\Mvc\Controller\ActionController;
use Neos\Flow\Mvc\View\JsonView;
use Neos\Neos\View\FusionView;

class NodeRenderController extends ActionController
{
    /**
     * @var JsonView
     */
    protected $view;

    protected $viewObjectNamePattern = JsonView::class;

    public function renderNodeAction(NodeInterface $node, string $fusionPath = 'root')
    {
        $fusionView = new FusionView();
        $fusionView->setControllerContext($this->controllerContext);
        $fusionView->setFusionPath($fusionPath);
        $fusionView->assign('value', $node);

        $this->view->assign('html', $fusionView->render());
        $this->view->setVariablesToRender(['html']);
    }
}