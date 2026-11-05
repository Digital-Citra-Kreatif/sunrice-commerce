<?php

declare(strict_types=1);

namespace Workbench\App\Providers;

use Sunrice\Admin\Panel;
use Sunrice\Admin\PanelProvider;
use Sunrice\Cms\CmsPlugin;
use Sunrice\Commerce\CommercePlugin;

/** The panel of the tests and of the workbench store: the CMS, and the store after it. */
final class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel->path('admin')->plugin(CmsPlugin::make())->plugin(CommercePlugin::make());
    }
}
