<?php

namespace Modules\Accounting\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use InvoiceShelf\Modules\Registry as ModuleRegistry;
use InvoiceShelf\Modules\Support\ModuleServiceProvider;
use Modules\Accounting\Models\Account;
use Modules\Accounting\Policies\AccountingPolicy;
use Silber\Bouncer\BouncerFacade;

class AccountingServiceProvider extends ModuleServiceProvider
{
    protected string $name = 'Accounting';
    protected string $nameLower = 'accounting';

    protected array $providers = [
        EventServiceProvider::class,
        RouteServiceProvider::class,
    ];

    public function boot(): void
    {
        parent::boot();

        $slug = Str::kebab($this->name);

        // Register policy and ability
        Gate::policy(Account::class, AccountingPolicy::class);
        BouncerFacade::allow('owner')->to('manage-accounting');
        BouncerFacade::allow('super admin')->to('manage-accounting');

        // Register console commands
        $this->commands([
            \Modules\Accounting\Console\Commands\CheckAccountingIntegrity::class,
            \Modules\Accounting\Console\Commands\RepairAccountingEntries::class,
        ]);

        ModuleRegistry::registerScript(
            $slug,
            module_path($this->name, 'resources/dist/init.js')
        );

        ModuleRegistry::registerMenu($slug, [
            'title' => $this->nameLower.'::menu.title',
            'link' => '/admin/modules/'.$slug.'/dashboard',
            'icon' => 'CalculatorIcon',
        ]);

        ModuleRegistry::registerSettings($slug, [
            'sections' => [
                [
                    'title' => $this->nameLower.'::settings.general_section',
                    'fields' => [
                        [
                            'key' => 'default_ar_account',
                            'type' => 'number',
                            'label' => $this->nameLower.'::settings.default_ar_account',
                            'default' => null,
                        ],
                        [
                            'key' => 'default_ap_account',
                            'type' => 'number',
                            'label' => $this->nameLower.'::settings.default_ap_account',
                            'default' => null,
                        ],
                        [
                            'key' => 'default_revenue_account',
                            'type' => 'number',
                            'label' => $this->nameLower.'::settings.default_revenue_account',
                            'default' => null,
                        ],
                        [
                            'key' => 'default_cash_account',
                            'type' => 'number',
                            'label' => $this->nameLower.'::settings.default_cash_account',
                            'default' => null,
                        ],
                        [
                            'key' => 'accounting_method',
                            'type' => 'select',
                            'label' => $this->nameLower.'::settings.accounting_method',
                            'default' => 'accrual',
                            'options' => [
                                'cash' => 'Cash basis',
                                'accrual' => 'Accrual basis',
                            ],
                        ],
                        [
                            'key' => 'default_expense_account',
                            'type' => 'number',
                            'label' => $this->nameLower.'::settings.default_expense_account',
                            'default' => null,
                        ],
                        [
                            'key' => 'fiscal_year_start',
                            'type' => 'number',
                            'label' => $this->nameLower.'::settings.fiscal_year_start',
                            'rules' => ['integer', 'min:1', 'max:12'],
                            'default' => 1,
                        ],
                    ],
                ],
            ],
        ]);
    }
}
