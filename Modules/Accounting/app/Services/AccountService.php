<?php

namespace Modules\Accounting\Services;

use Modules\Accounting\Models\Account;

class AccountService
{
    public function create(array $data): Account
    {
        return Account::create($data);
    }

    public function update(Account $account, array $data): Account
    {
        $account->update($data);

        return $account;
    }

    public function delete(Account $account): bool
    {
        if ($account->is_system) {
            throw new \InvalidArgumentException('Cannot delete system accounts.');
        }

        if ($account->journalEntryLines()->exists()) {
            throw new \InvalidArgumentException('Cannot delete account with journal entries.');
        }

        return $account->delete();
    }

    public function buildTree(int $companyId): array
    {
        $accounts = Account::whereCompany($companyId)
            ->orderBy('code')
            ->get();

        return $this->buildTreeRecursive($accounts);
    }

    private function buildTreeRecursive($accounts, ?int $parentId = null): array
    {
        $branch = [];

        foreach ($accounts as $account) {
            if ($account->parent_id === $parentId) {
                $children = $this->buildTreeRecursive($accounts, $account->id);
                $item = $account->toArray();
                if ($children) {
                    $item['children'] = $children;
                }
                $branch[] = $item;
            }
        }

        return $branch;
    }
}
