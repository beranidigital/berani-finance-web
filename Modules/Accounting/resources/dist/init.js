import { t as e } from "./_plugin-vue_export-helper-BecorN_g.js";
import { a as t, i as n } from "./vue-router-EQMMI-OA.js";
import { t as r } from "./pinia-DEeWw8bf.js";
import { t as i } from "./client-BFTFkUuT.js";
import { n as a } from "./notification.store-Dfvbzuw-.js";
import { t as o } from "./dialog.store-CT3QKgQf.js";
const { Fragment: s, computed: c, createBlock: l, createCommentVNode: u, createElementBlock: d, createElementVNode: f, createTextVNode: p, createVNode: m, defineComponent: h, normalizeClass: g, normalizeStyle: _, onMounted: v, openBlock: y, ref: b, renderList: x, resolveComponent: S, toDisplayString: C, unref: w, watch: T, withCtx: E, withModifiers: D } = window.__invoiceshelf_vue;
//#region resources/js/pages/DashboardPage.vue
var O = {}, k = { class: "p-6" }, A = { class: "flex items-center gap-3" };
function j(e, t) {
	let n = S("BaseBreadcrumbItem"), r = S("BaseBreadcrumb"), i = S("BasePageHeader"), a = S("BaseIcon"), o = S("BaseCard"), s = S("BasePage");
	return y(), l(s, null, {
		default: E(() => [m(i, { title: "Accounting" }, {
			default: E(() => [m(r, null, {
				default: E(() => [m(n, {
					title: "Home",
					to: "dashboard"
				}), m(n, {
					title: "Accounting",
					to: "#",
					active: ""
				})]),
				_: 1
			})]),
			_: 1
		}), m(o, { class: "mt-6" }, {
			default: E(() => [f("div", k, [f("div", A, [m(a, {
				name: "CalculatorIcon",
				class: "h-8 w-8 text-primary-500"
			}), t[0] ||= f("h2", { class: "text-xl font-semibold text-heading" }, "Accounting Module", -1)]), t[1] ||= f("p", { class: "mt-3 text-sm text-muted leading-relaxed" }, " Double-entry accounting module for InvoiceShelf. Manage your chart of accounts, journal entries, fiscal periods, and financial reports. ", -1)])]),
			_: 1
		})]),
		_: 1
	});
}
var M = /* @__PURE__ */ e(O, [["render", j]]), N = new class {
	async list() {
		return (await i.get("/api/v1/accounting/accounts")).data;
	}
	async get(e) {
		return (await i.get(`/api/v1/accounting/accounts/${e}`)).data;
	}
	async create(e) {
		return (await i.post("/api/v1/accounting/accounts", e)).data;
	}
	async update(e, t) {
		return (await i.put(`/api/v1/accounting/accounts/${e}`, t)).data;
	}
	async delete(e) {
		await i.delete(`/api/v1/accounting/accounts/${e}`);
	}
}(), P = r("accounting-account", {
	state: () => ({
		accounts: [],
		loading: !1
	}),
	getters: { accountsByType: (e) => {
		let t = {};
		for (let n of e.accounts) t[n.type] || (t[n.type] = []), t[n.type].push(n);
		return t;
	} },
	actions: {
		async fetchAccounts() {
			this.loading = !0;
			try {
				this.accounts = (await N.list()).data;
			} finally {
				this.loading = !1;
			}
		},
		async createAccount(e) {
			let t = await N.create(e);
			return this.accounts.push(t.data), a().showNotification({
				type: "success",
				message: "Account created"
			}), t.data;
		},
		async updateAccount(e, t) {
			let n = await N.update(e, t), r = this.accounts.findIndex((t) => t.id === e);
			return r !== -1 && (this.accounts[r] = n.data), a().showNotification({
				type: "success",
				message: "Account updated"
			}), n.data;
		},
		async deleteAccount(e) {
			await N.delete(e), this.accounts = this.accounts.filter((t) => t.id !== e), a().showNotification({
				type: "success",
				message: "Account deleted"
			});
		}
	}
}), F = {
	precision: 2,
	thousand_separator: ",",
	decimal_separator: ".",
	symbol: "$",
	swap_currency_symbol: !1
};
function I(e, t = F) {
	let n = e / 100, { symbol: r, swap_currency_symbol: i = !1 } = t, a = Math.abs(t.precision);
	Number.isNaN(a) && (a = 2);
	let o = n < 0 ? "-" : "";
	n = Math.abs(Number(n) || 0);
	let s = n.toFixed(a), c = parseInt(s, 10).toString(), l = c.length > 3 ? c.length % 3 : 0, u = l ? c.substring(0, l) + t.thousand_separator : "", d = c.substring(l).replace(/(\d{3})(?=\d)/g, "$1" + t.thousand_separator), f = a ? t.decimal_separator + Math.abs(n - parseInt(s, 10)).toFixed(a).slice(2) : "", p = o + u + d + f, m = `${r}`;
	return i ? `${p} ${m}` : `${m} ${p}`;
}
//#endregion
//#region ../../resources/scripts/composables/use-currency.ts
var L = b([]), R = {
	precision: 2,
	thousand_separator: ",",
	decimal_separator: ".",
	symbol: "$",
	swap_currency_symbol: !1
};
function z() {
	function e(e) {
		L.value = e;
	}
	function t(e, t) {
		return I(e, t ?? R);
	}
	function n(e, t, n) {
		return t === 0 ? 0 : Math.round(e / t * n);
	}
	function r(e) {
		return L.value.find((t) => t.code.toUpperCase() === e.toUpperCase());
	}
	return {
		currencies: L,
		setCurrencies: e,
		formatMoney: t,
		convertCurrency: n,
		findCurrencyByCode: r
	};
}
//#endregion
//#region resources/js/views/accounts/AccountIndexView.vue?vue&type=script&setup=true&lang.ts
var B = { class: "p-6" }, V = {
	key: 0,
	class: "flex justify-center py-8"
}, ee = {
	key: 1,
	class: "text-center py-8"
}, H = { class: "font-mono text-sm text-heading" }, U = { class: "flex gap-2" }, W = /* @__PURE__ */ h({
	__name: "AccountIndexView",
	setup(e) {
		let n = t(), r = P(), i = o(), s = a(), { formatMoney: h } = z(), _ = b(!0), x = c(() => r.accounts), T = [
			{
				key: "code",
				label: "Code",
				sortable: !1
			},
			{
				key: "name",
				label: "Name",
				sortable: !1
			},
			{
				key: "type",
				label: "Type",
				sortable: !1
			},
			{
				key: "balance",
				label: "Balance",
				sortable: !1
			},
			{
				key: "actions",
				label: "",
				sortable: !1
			}
		], D = (e) => ({
			asset: "bg-blue-100 text-blue-800",
			liability: "bg-yellow-100 text-yellow-800",
			equity: "bg-purple-100 text-purple-800",
			revenue: "bg-green-100 text-green-800",
			expense: "bg-red-100 text-red-800"
		})[e] || "bg-gray-100 text-gray-800";
		function O(e) {
			n.push({
				name: "modules.accounting.accounts.edit",
				params: { id: e.id }
			});
		}
		async function k(e) {
			if (await i.openDialog({
				title: "Delete Account",
				message: `Are you sure you want to delete "${e.name}"?`,
				variant: "danger"
			})) try {
				await r.deleteAccount(e.id);
			} catch (e) {
				s.showNotification({
					type: "error",
					message: e.response?.data?.message || "Delete failed"
				});
			}
		}
		return v(async () => {
			await r.fetchAccounts(), _.value = !1;
		}), (e, t) => {
			let r = S("BaseBreadcrumbItem"), i = S("BaseBreadcrumb"), a = S("BaseButton"), o = S("BasePageHeader"), s = S("BaseSpinner"), c = S("BaseIcon"), v = S("router-link"), b = S("BaseTable"), A = S("BaseCard"), j = S("BasePage");
			return y(), l(j, null, {
				default: E(() => [m(o, { title: "Chart of Accounts" }, {
					actions: E(() => [m(a, {
						variant: "primary",
						onClick: t[0] ||= (e) => w(n).push({ name: "modules.accounting.accounts.create" })
					}, {
						default: E(() => [...t[1] ||= [p(" Add Account ", -1)]]),
						_: 1
					})]),
					default: E(() => [m(i, null, {
						default: E(() => [
							m(r, {
								title: "Home",
								to: "dashboard"
							}),
							m(r, {
								title: "Accounting",
								to: "modules.accounting.dashboard"
							}),
							m(r, {
								title: "Chart of Accounts",
								to: "#",
								active: ""
							})
						]),
						_: 1
					})]),
					_: 1
				}), m(A, { class: "mt-6" }, {
					default: E(() => [f("div", B, [_.value ? (y(), d("div", V, [m(s)])) : x.value.length === 0 ? (y(), d("div", ee, [m(c, {
						name: "BanknotesIcon",
						class: "mx-auto h-12 w-12 text-muted"
					}), t[2] ||= f("p", { class: "mt-4 text-sm text-muted" }, "No accounts yet. Create your first account to get started.", -1)])) : (y(), l(b, {
						key: 2,
						columns: T,
						data: x.value
					}, {
						"cell-code": E(({ row: e }) => [f("span", H, C(e.code), 1)]),
						"cell-name": E(({ row: e }) => [m(v, {
							to: {
								name: "modules.accounting.accounts.show",
								params: { id: e.id }
							},
							class: "text-sm font-medium text-primary-600 hover:text-primary-700"
						}, {
							default: E(() => [p(C(e.name), 1)]),
							_: 2
						}, 1032, ["to"])]),
						"cell-type": E(({ row: e }) => [f("span", { class: g(["px-2 py-1 text-sm font-normal uppercase rounded", D(e.type)]) }, C(e.type), 3)]),
						"cell-balance": E(({ row: e }) => [f("span", { class: g(["text-sm", e.net_balance >= 0 ? "text-status-green" : "text-status-red"]) }, C(w(h)(e.net_balance)), 3)]),
						"cell-actions": E(({ row: e }) => [f("div", U, [m(a, {
							size: "sm",
							variant: "secondary",
							onClick: (t) => O(e)
						}, {
							default: E(() => [...t[3] ||= [p("Edit", -1)]]),
							_: 1
						}, 8, ["onClick"]), e.is_system ? u("", !0) : (y(), l(a, {
							key: 0,
							size: "sm",
							variant: "danger",
							onClick: (t) => k(e)
						}, {
							default: E(() => [...t[4] ||= [p("Delete", -1)]]),
							_: 1
						}, 8, ["onClick"]))])]),
						_: 1
					}, 8, ["data"]))])]),
					_: 1
				})]),
				_: 1
			});
		};
	}
}), G = { class: "p-6" }, K = { class: "grid grid-cols-1 gap-6 md:grid-cols-2" }, q = { class: "md:col-span-2" }, te = { class: "mt-6 flex gap-3" }, ne = /* @__PURE__ */ h({
	__name: "AccountFormView",
	setup(e) {
		let r = t(), i = n(), a = P(), o = c(() => !!i.params.id), s = b(!1), u = b({}), d = b({
			name: "",
			code: "",
			type: "asset",
			parent_id: null,
			description: null,
			is_active: !0
		}), h = [
			{
				value: "asset",
				label: "Asset"
			},
			{
				value: "liability",
				label: "Liability"
			},
			{
				value: "equity",
				label: "Equity"
			},
			{
				value: "revenue",
				label: "Revenue"
			},
			{
				value: "expense",
				label: "Expense"
			}
		], g = c(() => a.accounts.map((e) => ({
			value: e.id,
			label: `[${e.code}] ${e.name}`
		})));
		async function _() {
			s.value = !0, u.value = {};
			try {
				o.value ? await a.updateAccount(Number(i.params.id), d.value) : await a.createAccount(d.value), r.push({ name: "modules.accounting.accounts.index" });
			} catch (e) {
				e.response?.status === 422 && (u.value = e.response.data.errors || {});
			} finally {
				s.value = !1;
			}
		}
		return v(async () => {
			if (a.accounts.length === 0 && await a.fetchAccounts(), o.value) {
				let e = a.accounts.find((e) => e.id === Number(i.params.id));
				e && (d.value = {
					name: e.name,
					code: e.code,
					type: e.type,
					parent_id: e.parent_id,
					description: e.description || null,
					is_active: e.is_active
				});
			}
		}), (e, t) => {
			let n = S("BaseBreadcrumbItem"), i = S("BaseBreadcrumb"), a = S("BasePageHeader"), c = S("BaseInput"), v = S("BaseInputGroup"), b = S("BaseSelectInput"), x = S("BaseTextarea"), T = S("BaseSwitch"), O = S("BaseButton"), k = S("BaseCard"), A = S("BasePage");
			return y(), l(A, null, {
				default: E(() => [m(a, { title: o.value ? "Edit Account" : "New Account" }, {
					default: E(() => [m(i, null, {
						default: E(() => [
							m(n, {
								title: "Home",
								to: "dashboard"
							}),
							m(n, {
								title: "Accounting",
								to: "modules.accounting.dashboard"
							}),
							m(n, {
								title: "Chart of Accounts",
								to: "modules.accounting.accounts.index"
							}),
							m(n, {
								title: o.value ? "Edit" : "New",
								to: "#",
								active: ""
							}, null, 8, ["title"])
						]),
						_: 1
					})]),
					_: 1
				}, 8, ["title"]), m(k, { class: "mt-6" }, {
					default: E(() => [f("div", G, [f("form", { onSubmit: D(_, ["prevent"]) }, [f("div", K, [
						m(v, {
							label: "Account Name",
							error: u.value.name
						}, {
							default: E(() => [m(c, {
								modelValue: d.value.name,
								"onUpdate:modelValue": t[0] ||= (e) => d.value.name = e,
								required: ""
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["error"]),
						m(v, {
							label: "Account Code",
							error: u.value.code
						}, {
							default: E(() => [m(c, {
								modelValue: d.value.code,
								"onUpdate:modelValue": t[1] ||= (e) => d.value.code = e,
								required: ""
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["error"]),
						m(v, {
							label: "Account Type",
							error: u.value.type
						}, {
							default: E(() => [m(b, {
								modelValue: d.value.type,
								"onUpdate:modelValue": t[2] ||= (e) => d.value.type = e,
								required: "",
								options: h
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["error"]),
						m(v, {
							label: "Parent Account",
							error: u.value.parent_id
						}, {
							default: E(() => [m(b, {
								modelValue: d.value.parent_id,
								"onUpdate:modelValue": t[3] ||= (e) => d.value.parent_id = e,
								options: g.value
							}, null, 8, ["modelValue", "options"])]),
							_: 1
						}, 8, ["error"]),
						f("div", q, [m(v, {
							label: "Description",
							error: u.value.description
						}, {
							default: E(() => [m(x, {
								modelValue: d.value.description,
								"onUpdate:modelValue": t[4] ||= (e) => d.value.description = e
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["error"])]),
						m(v, { label: "Active" }, {
							default: E(() => [m(T, {
								modelValue: d.value.is_active,
								"onUpdate:modelValue": t[5] ||= (e) => d.value.is_active = e
							}, null, 8, ["modelValue"])]),
							_: 1
						})
					]), f("div", te, [m(O, {
						type: "submit",
						variant: "primary",
						loading: s.value
					}, {
						default: E(() => [p(C(o.value ? "Update" : "Create"), 1)]),
						_: 1
					}, 8, ["loading"]), m(O, {
						variant: "secondary",
						onClick: t[6] ||= (e) => w(r).back()
					}, {
						default: E(() => [...t[7] ||= [p("Cancel", -1)]]),
						_: 1
					})])], 32)])]),
					_: 1
				})]),
				_: 1
			});
		};
	}
}), re = { class: "mt-6 grid grid-cols-1 gap-6 md:grid-cols-3" }, ie = { class: "p-4" }, ae = { class: "mt-1 text-lg font-semibold text-heading font-mono" }, oe = { class: "p-4" }, se = { class: "mt-1" }, ce = { class: "p-4" }, le = { class: "p-4" }, ue = {
	key: 0,
	class: "flex justify-center py-4"
}, de = { class: "font-mono" }, fe = { class: "font-mono" }, pe = /* @__PURE__ */ h({
	__name: "AccountDetailView",
	setup(e) {
		let r = n(), a = t(), o = P(), { formatMoney: s } = z(), u = c(() => o.accounts.find((e) => e.id === Number(r.params.id))), h = b([]), _ = b(!0), x = [
			{
				key: "date",
				label: "Date",
				sortable: !1
			},
			{
				key: "type",
				label: "Type",
				sortable: !1
			},
			{
				key: "amount",
				label: "Amount",
				sortable: !1
			},
			{
				key: "balance",
				label: "Running Balance",
				sortable: !1
			}
		], T = (e) => ({
			asset: "bg-blue-100 text-blue-800",
			liability: "bg-yellow-100 text-yellow-800",
			equity: "bg-purple-100 text-purple-800",
			revenue: "bg-green-100 text-green-800",
			expense: "bg-red-100 text-red-800"
		})[e || ""] || "bg-gray-100 text-gray-800";
		return v(async () => {
			o.accounts.length === 0 && await o.fetchAccounts();
			try {
				h.value = (await i.get("/api/v1/accounting/ledger", { params: {
					account_id: r.params.id,
					limit: 50
				} })).data.data;
			} finally {
				_.value = !1;
			}
		}), (e, t) => {
			let n = S("BaseBreadcrumbItem"), r = S("BaseBreadcrumb"), i = S("BaseButton"), o = S("BasePageHeader"), c = S("BaseCard"), v = S("BaseSpinner"), b = S("BaseTable"), D = S("BasePage");
			return y(), l(D, null, {
				default: E(() => [
					m(o, { title: u.value?.name || "Account" }, {
						actions: E(() => [m(i, {
							variant: "secondary",
							onClick: t[0] ||= (e) => w(a).push({
								name: "modules.accounting.accounts.edit",
								params: { id: u.value?.id }
							})
						}, {
							default: E(() => [...t[1] ||= [p(" Edit ", -1)]]),
							_: 1
						})]),
						default: E(() => [m(r, null, {
							default: E(() => [
								m(n, {
									title: "Home",
									to: "dashboard"
								}),
								m(n, {
									title: "Accounting",
									to: "modules.accounting.dashboard"
								}),
								m(n, {
									title: "Chart of Accounts",
									to: "modules.accounting.accounts.index"
								}),
								m(n, {
									title: u.value?.name || "",
									to: "#",
									active: ""
								}, null, 8, ["title"])
							]),
							_: 1
						})]),
						_: 1
					}, 8, ["title"]),
					f("div", re, [
						m(c, null, {
							default: E(() => [f("div", ie, [t[2] ||= f("p", { class: "text-sm text-muted" }, "Account Code", -1), f("p", ae, C(u.value?.code), 1)])]),
							_: 1
						}),
						m(c, null, {
							default: E(() => [f("div", oe, [t[3] ||= f("p", { class: "text-sm text-muted" }, "Type", -1), f("p", se, [f("span", { class: g(["px-2 py-1 text-sm font-normal uppercase rounded", T(u.value?.type)]) }, C(u.value?.type), 3)])])]),
							_: 1
						}),
						m(c, null, {
							default: E(() => [f("div", ce, [t[4] ||= f("p", { class: "text-sm text-muted" }, "Net Balance", -1), f("p", { class: g(["mt-1 text-lg font-semibold", (u.value?.net_balance ?? 0) >= 0 ? "text-status-green" : "text-status-red"]) }, C(u.value ? w(s)(u.value.net_balance) : "-"), 3)])]),
							_: 1
						})
					]),
					m(c, { class: "mt-6" }, {
						default: E(() => [f("div", le, [t[5] ||= f("h3", { class: "text-sm font-semibold text-heading mb-4" }, "Ledger Entries", -1), _.value ? (y(), d("div", ue, [m(v)])) : (y(), l(b, {
							key: 1,
							columns: x,
							data: h.value
						}, {
							"cell-date": E(({ row: e }) => [p(C(e.date), 1)]),
							"cell-type": E(({ row: e }) => [f("span", { class: g(["px-2 py-1 text-sm font-normal uppercase rounded", e.type === "debit" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"]) }, C(e.type), 3)]),
							"cell-amount": E(({ row: e }) => [f("span", de, C(w(s)(e.amount)), 1)]),
							"cell-balance": E(({ row: e }) => [f("span", fe, C(w(s)(e.running_balance)), 1)]),
							_: 1
						}, 8, ["data"]))])]),
						_: 1
					})
				]),
				_: 1
			});
		};
	}
}), J = new class {
	async list(e) {
		return (await i.get("/api/v1/accounting/journal-entries", { params: e })).data;
	}
	async get(e) {
		return (await i.get(`/api/v1/accounting/journal-entries/${e}`)).data;
	}
	async create(e) {
		return (await i.post("/api/v1/accounting/journal-entries", e)).data;
	}
	async reverse(e) {
		return (await i.post(`/api/v1/accounting/journal-entries/${e}/reverse`)).data;
	}
}(), Y = r("accounting-journal-entry", {
	state: () => ({
		entries: [],
		total: 0,
		currentPage: 1,
		lastPage: 1,
		loading: !1
	}),
	actions: {
		async fetchEntries(e = 1) {
			this.loading = !0;
			try {
				let t = await J.list({
					page: e,
					limit: 25
				});
				this.entries = t.data, this.total = t.meta.total, this.currentPage = t.meta.current_page, this.lastPage = t.meta.last_page;
			} finally {
				this.loading = !1;
			}
		},
		async createEntry(e) {
			let t = await J.create(e);
			return this.entries.unshift(t.data), a().showNotification({
				type: "success",
				message: "Journal entry created"
			}), t.data;
		},
		async reverseEntry(e) {
			let t = await J.reverse(e);
			return this.entries.unshift(t.data), a().showNotification({
				type: "success",
				message: "Journal entry reversed"
			}), t.data;
		}
	}
}), me = { class: "p-6" }, he = { class: "text-sm text-heading" }, ge = { class: "font-mono text-sm" }, _e = { class: "font-mono text-sm" }, ve = /* @__PURE__ */ h({
	__name: "JournalEntryIndexView",
	setup(e) {
		let n = t(), r = Y(), { formatMoney: i } = z(), a = b(null), o = [
			{
				key: "entry_number",
				label: "Entry #",
				sortable: !1
			},
			{
				key: "date",
				label: "Date",
				sortable: !1
			},
			{
				key: "description",
				label: "Description",
				sortable: !1
			},
			{
				key: "balanced",
				label: "Status",
				sortable: !1
			},
			{
				key: "debits",
				label: "Total Debits",
				sortable: !1
			},
			{
				key: "credits",
				label: "Total Credits",
				sortable: !1
			}
		];
		async function s({ page: e, sort: t }) {
			return await r.fetchEntries(e), {
				data: r.entries,
				pagination: {
					totalPages: r.lastPage,
					currentPage: r.currentPage,
					totalCount: r.total,
					limit: 25
				}
			};
		}
		return (e, t) => {
			let r = S("BaseBreadcrumbItem"), c = S("BaseBreadcrumb"), u = S("BaseButton"), d = S("BasePageHeader"), h = S("router-link"), _ = S("BaseTable"), v = S("BaseCard"), b = S("BasePage");
			return y(), l(b, null, {
				default: E(() => [m(d, { title: "Journal Entries" }, {
					actions: E(() => [m(u, {
						variant: "primary",
						onClick: t[0] ||= (e) => w(n).push({ name: "modules.accounting.journal-entries.create" })
					}, {
						default: E(() => [...t[1] ||= [p(" New Entry ", -1)]]),
						_: 1
					})]),
					default: E(() => [m(c, null, {
						default: E(() => [
							m(r, {
								title: "Home",
								to: "dashboard"
							}),
							m(r, {
								title: "Accounting",
								to: "modules.accounting.dashboard"
							}),
							m(r, {
								title: "Journal Entries",
								to: "#",
								active: ""
							})
						]),
						_: 1
					})]),
					_: 1
				}), m(v, { class: "mt-6" }, {
					default: E(() => [f("div", me, [m(_, {
						ref_key: "tableRef",
						ref: a,
						columns: o,
						data: s
					}, {
						"cell-entry_number": E(({ row: e }) => [m(h, {
							to: {
								name: "modules.accounting.journal-entries.show",
								params: { id: e.id }
							},
							class: "font-mono text-sm text-primary-600 hover:text-primary-700"
						}, {
							default: E(() => [p(C(e.entry_number), 1)]),
							_: 2
						}, 1032, ["to"])]),
						"cell-date": E(({ row: e }) => [p(C(e.date), 1)]),
						"cell-description": E(({ row: e }) => [f("span", he, C(e.description), 1)]),
						"cell-balanced": E(({ row: e }) => [f("span", { class: g(["px-2 py-1 text-sm font-normal uppercase rounded", e.is_balanced ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"]) }, C(e.is_balanced ? "Balanced" : "Unbalanced"), 3)]),
						"cell-debits": E(({ row: e }) => [f("span", ge, C(w(i)(e.debits_total)), 1)]),
						"cell-credits": E(({ row: e }) => [f("span", _e, C(w(i)(e.credits_total)), 1)]),
						_: 1
					}, 512)])]),
					_: 1
				})]),
				_: 1
			});
		};
	}
}), ye = { class: "p-6" }, be = { class: "grid grid-cols-1 gap-6 md:grid-cols-2" }, xe = { class: "md:col-span-2" }, Se = { class: "mt-3 overflow-x-auto" }, Ce = { class: "w-full text-sm" }, we = { class: "py-2 pr-4" }, Te = { class: "py-2 pr-4" }, Ee = { class: "py-2 pr-4" }, De = { class: "py-2 pr-4" }, Oe = { class: "py-2" }, ke = { class: "mt-4 flex gap-4 text-sm" }, Ae = { class: "flex items-center gap-2" }, je = { class: "font-semibold text-heading font-mono" }, Me = { class: "flex items-center gap-2" }, Ne = { class: "font-semibold text-heading font-mono" }, Pe = { class: "flex items-center gap-2" }, Fe = { class: "mt-6 flex gap-3" }, Ie = /* @__PURE__ */ h({
	__name: "JournalEntryCreateView",
	setup(e) {
		let n = t(), r = Y(), i = P(), { formatMoney: a } = z(), o = b(!1), h = b({
			date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			description: "",
			lines: [{
				account_id: null,
				type: "debit",
				amount: 0,
				description: ""
			}, {
				account_id: null,
				type: "credit",
				amount: 0,
				description: ""
			}]
		}), _ = b(["", ""]), T = [{
			value: "debit",
			label: "Debit"
		}, {
			value: "credit",
			label: "Credit"
		}], O = c(() => i.accounts.map((e) => ({
			value: e.id,
			label: `[${e.code}] ${e.name}`
		}))), k = c(() => h.value.lines.filter((e) => e.type === "debit").reduce((e, t) => e + t.amount, 0)), A = c(() => h.value.lines.filter((e) => e.type === "credit").reduce((e, t) => e + t.amount, 0)), j = c(() => k.value - A.value);
		function M(e, t) {
			h.value.lines[e].amount = Math.round(parseFloat(t || "0") * 100);
		}
		function N() {
			h.value.lines.length, h.value.lines.push({
				account_id: null,
				type: "debit",
				amount: 0,
				description: ""
			}), _.value.push("");
		}
		function F(e) {
			h.value.lines.splice(e, 1), _.value.splice(e, 1);
		}
		async function I() {
			o.value = !0;
			try {
				await r.createEntry({
					date: h.value.date,
					description: h.value.description,
					lines: h.value.lines.map((e) => ({
						account_id: e.account_id,
						type: e.type,
						amount: e.amount,
						description: e.description || null
					}))
				}), n.push({ name: "modules.accounting.journal-entries.index" });
			} finally {
				o.value = !1;
			}
		}
		return v(async () => {
			i.accounts.length === 0 && await i.fetchAccounts();
		}), (e, t) => {
			let r = S("BaseBreadcrumbItem"), i = S("BaseBreadcrumb"), c = S("BasePageHeader"), v = S("BaseDatePicker"), b = S("BaseInputGroup"), P = S("BaseInput"), L = S("BaseSelectInput"), R = S("BaseIcon"), z = S("BaseButton"), B = S("BaseCard"), V = S("BasePage");
			return y(), l(V, null, {
				default: E(() => [m(c, { title: "New Journal Entry" }, {
					default: E(() => [m(i, null, {
						default: E(() => [
							m(r, {
								title: "Home",
								to: "dashboard"
							}),
							m(r, {
								title: "Accounting",
								to: "modules.accounting.dashboard"
							}),
							m(r, {
								title: "Journal Entries",
								to: "modules.accounting.journal-entries.index"
							}),
							m(r, {
								title: "New",
								to: "#",
								active: ""
							})
						]),
						_: 1
					})]),
					_: 1
				}), m(B, { class: "mt-6" }, {
					default: E(() => [f("div", ye, [f("form", { onSubmit: D(I, ["prevent"]) }, [
						f("div", be, [
							m(b, {
								label: "Date",
								required: ""
							}, {
								default: E(() => [m(v, {
									modelValue: h.value.date,
									"onUpdate:modelValue": t[0] ||= (e) => h.value.date = e,
									required: ""
								}, null, 8, ["modelValue"])]),
								_: 1
							}),
							t[3] ||= f("div", null, null, -1),
							f("div", xe, [m(b, {
								label: "Description",
								required: ""
							}, {
								default: E(() => [m(P, {
									modelValue: h.value.description,
									"onUpdate:modelValue": t[1] ||= (e) => h.value.description = e,
									required: ""
								}, null, 8, ["modelValue"])]),
								_: 1
							})])
						]),
						t[11] ||= f("h3", { class: "mt-6 text-sm font-semibold text-heading" }, "Entry Lines", -1),
						f("div", Se, [f("table", Ce, [t[4] ||= f("thead", null, [f("tr", { class: "border-b border-line-default" }, [
							f("th", { class: "py-2 pr-4 text-left text-xs font-medium text-muted uppercase" }, "Account"),
							f("th", { class: "py-2 pr-4 text-left text-xs font-medium text-muted uppercase" }, "Type"),
							f("th", { class: "py-2 pr-4 text-right text-xs font-medium text-muted uppercase" }, "Amount"),
							f("th", { class: "py-2 pr-4 text-left text-xs font-medium text-muted uppercase" }, "Description"),
							f("th", { class: "py-2 w-10" })
						])], -1), f("tbody", null, [(y(!0), d(s, null, x(h.value.lines, (e, t) => (y(), d("tr", {
							key: t,
							class: "border-b border-line-light"
						}, [
							f("td", we, [m(L, {
								modelValue: e.account_id,
								"onUpdate:modelValue": (t) => e.account_id = t,
								options: O.value,
								placeholder: "Select account",
								required: ""
							}, null, 8, [
								"modelValue",
								"onUpdate:modelValue",
								"options"
							])]),
							f("td", Te, [m(L, {
								modelValue: e.type,
								"onUpdate:modelValue": (t) => e.type = t,
								options: T,
								required: ""
							}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
							f("td", Ee, [m(P, {
								modelValue: _.value[t],
								"onUpdate:modelValue": [(e) => _.value[t] = e, (e) => M(t, e)],
								type: "number",
								min: "0",
								step: "0.01",
								class: "text-right",
								required: ""
							}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
							f("td", De, [m(P, {
								modelValue: e.description,
								"onUpdate:modelValue": (t) => e.description = t,
								placeholder: "Optional"
							}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
							f("td", Oe, [h.value.lines.length > 2 ? (y(), l(z, {
								key: 0,
								size: "sm",
								variant: "danger",
								onClick: (e) => F(t)
							}, {
								default: E(() => [m(R, {
									name: "XMarkIcon",
									class: "h-4 w-4"
								})]),
								_: 1
							}, 8, ["onClick"])) : u("", !0)])
						]))), 128))])])]),
						m(z, {
							size: "sm",
							variant: "secondary",
							class: "mt-3",
							onClick: N
						}, {
							default: E(() => [...t[5] ||= [p(" + Add Line ", -1)]]),
							_: 1
						}),
						f("div", ke, [
							f("div", Ae, [t[6] ||= f("span", { class: "text-muted" }, "Total Debits:", -1), f("span", je, C(w(a)(k.value)), 1)]),
							f("div", Me, [t[7] ||= f("span", { class: "text-muted" }, "Total Credits:", -1), f("span", Ne, C(w(a)(A.value)), 1)]),
							f("div", Pe, [t[8] ||= f("span", { class: "text-muted" }, "Difference:", -1), f("span", { class: g(["font-semibold font-mono", j.value === 0 ? "text-status-green" : "text-status-red"]) }, C(w(a)(j.value)), 3)])
						]),
						f("div", Fe, [m(z, {
							type: "submit",
							variant: "primary",
							disabled: j.value !== 0 || o.value,
							loading: o.value
						}, {
							default: E(() => [...t[9] ||= [p(" Create Entry ", -1)]]),
							_: 1
						}, 8, ["disabled", "loading"]), m(z, {
							variant: "secondary",
							onClick: t[2] ||= (e) => w(n).back()
						}, {
							default: E(() => [...t[10] ||= [p("Cancel", -1)]]),
							_: 1
						})])
					], 32)])]),
					_: 1
				})]),
				_: 1
			});
		};
	}
}), Le = {
	key: 0,
	class: "mt-6 flex justify-center py-8"
}, Re = { class: "mt-6 grid grid-cols-1 gap-6 md:grid-cols-3" }, ze = { class: "p-4" }, Be = { class: "mt-1 text-lg font-semibold text-heading font-mono" }, Ve = { class: "p-4" }, He = { class: "mt-1 text-lg font-semibold text-heading" }, Ue = { class: "p-4" }, We = { class: "mt-1" }, Ge = { class: "p-4" }, Ke = { class: "text-sm text-heading" }, qe = { class: "p-4" }, Je = { class: "w-full text-sm" }, Ye = { class: "py-2 pr-4 text-heading" }, Xe = { class: "py-2 pr-4 font-mono text-muted" }, Ze = { class: "py-2 pr-4" }, Qe = { class: "py-2 pr-4 text-right font-mono" }, $e = { class: "py-2 text-muted" }, et = { class: "border-t-2 border-line-default font-semibold" }, tt = { class: "py-2 pr-4 text-right font-mono text-heading" }, nt = /* @__PURE__ */ h({
	__name: "JournalEntryDetailView",
	setup(e) {
		let r = n();
		t();
		let i = Y(), c = o(), u = a(), { formatMoney: h } = z(), _ = b(null);
		async function T() {
			if (await c.openDialog({
				title: "Reverse Entry",
				message: "This will create a reversing journal entry. Continue?",
				variant: "warning"
			})) try {
				await i.reverseEntry(Number(r.params.id)), await D(), u.showNotification({
					type: "success",
					message: "Entry reversed"
				});
			} catch (e) {
				u.showNotification({
					type: "error",
					message: e.response?.data?.message || "Reverse failed"
				});
			}
		}
		async function D() {
			_.value = (await J.get(Number(r.params.id))).data;
		}
		return v(D), (e, t) => {
			let n = S("BaseBreadcrumbItem"), r = S("BaseBreadcrumb"), i = S("BaseButton"), a = S("BasePageHeader"), o = S("BaseSpinner"), c = S("BaseCard"), u = S("BasePage");
			return y(), l(u, null, {
				default: E(() => [m(a, { title: "Entry " + _.value?.entry_number }, {
					actions: E(() => [m(i, {
						variant: "secondary",
						onClick: T,
						disabled: !_.value
					}, {
						default: E(() => [...t[0] ||= [p(" Reverse Entry ", -1)]]),
						_: 1
					}, 8, ["disabled"])]),
					default: E(() => [m(r, null, {
						default: E(() => [
							m(n, {
								title: "Home",
								to: "dashboard"
							}),
							m(n, {
								title: "Accounting",
								to: "modules.accounting.dashboard"
							}),
							m(n, {
								title: "Journal Entries",
								to: "modules.accounting.journal-entries.index"
							}),
							m(n, {
								title: "Entry " + _.value?.entry_number,
								to: "#",
								active: ""
							}, null, 8, ["title"])
						]),
						_: 1
					})]),
					_: 1
				}, 8, ["title"]), _.value ? (y(), d(s, { key: 1 }, [
					f("div", Re, [
						m(c, null, {
							default: E(() => [f("div", ze, [t[1] ||= f("p", { class: "text-sm text-muted" }, "Entry Number", -1), f("p", Be, C(_.value.entry_number), 1)])]),
							_: 1
						}),
						m(c, null, {
							default: E(() => [f("div", Ve, [t[2] ||= f("p", { class: "text-sm text-muted" }, "Date", -1), f("p", He, C(_.value.date), 1)])]),
							_: 1
						}),
						m(c, null, {
							default: E(() => [f("div", Ue, [t[3] ||= f("p", { class: "text-sm text-muted" }, "Status", -1), f("p", We, [f("span", { class: g(["px-2 py-1 text-sm font-normal uppercase rounded", _.value.is_balanced ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"]) }, C(_.value.is_balanced ? "Balanced" : "Unbalanced"), 3)])])]),
							_: 1
						})
					]),
					m(c, { class: "mt-6" }, {
						default: E(() => [f("div", Ge, [t[4] ||= f("p", { class: "text-sm text-muted mb-1" }, "Description", -1), f("p", Ke, C(_.value.description), 1)])]),
						_: 1
					}),
					m(c, { class: "mt-6" }, {
						default: E(() => [f("div", qe, [t[10] ||= f("h3", { class: "text-sm font-semibold text-heading mb-4" }, "Lines", -1), f("table", Je, [
							t[9] ||= f("thead", null, [f("tr", { class: "border-b border-line-default" }, [
								f("th", { class: "py-2 pr-4 text-left text-xs font-medium text-muted uppercase" }, "Account"),
								f("th", { class: "py-2 pr-4 text-left text-xs font-medium text-muted uppercase" }, "Code"),
								f("th", { class: "py-2 pr-4 text-left text-xs font-medium text-muted uppercase" }, "Type"),
								f("th", { class: "py-2 pr-4 text-right text-xs font-medium text-muted uppercase" }, "Amount"),
								f("th", { class: "py-2 text-left text-xs font-medium text-muted uppercase" }, "Description")
							])], -1),
							f("tbody", null, [(y(!0), d(s, null, x(_.value.lines, (e) => (y(), d("tr", {
								key: e.id,
								class: "border-b border-line-light"
							}, [
								f("td", Ye, C(e.account_name), 1),
								f("td", Xe, C(e.account_code), 1),
								f("td", Ze, [f("span", { class: g(["px-2 py-1 text-sm font-normal uppercase rounded", e.type === "debit" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"]) }, C(e.type), 3)]),
								f("td", Qe, C(w(h)(e.amount)), 1),
								f("td", $e, C(e.description || "-"), 1)
							]))), 128))]),
							f("tfoot", null, [f("tr", et, [
								t[6] ||= f("td", {
									class: "py-2 pr-4 text-heading",
									colspan: "2"
								}, "Totals", -1),
								t[7] ||= f("td", { class: "py-2 pr-4" }, null, -1),
								f("td", tt, [
									p(" Debits: " + C(w(h)(_.value.debits_total)) + " ", 1),
									t[5] ||= f("br", null, null, -1),
									p(" Credits: " + C(w(h)(_.value.credits_total)), 1)
								]),
								t[8] ||= f("td", { class: "py-2" }, null, -1)
							])])
						])])]),
						_: 1
					})
				], 64)) : (y(), d("div", Le, [m(o)]))]),
				_: 1
			});
		};
	}
}), X = new class {
	async trialBalance(e) {
		return (await i.get("/api/v1/accounting/reports/trial-balance", { params: e })).data;
	}
	async balanceSheet(e) {
		return (await i.get("/api/v1/accounting/reports/balance-sheet", { params: e })).data;
	}
	async incomeStatement(e) {
		return (await i.get("/api/v1/accounting/reports/income-statement", { params: e })).data;
	}
	async cashFlow(e) {
		return (await i.get("/api/v1/accounting/reports/cash-flow", { params: e })).data;
	}
	async arAging(e) {
		return (await i.get("/api/v1/accounting/reports/ar-aging", { params: e })).data;
	}
	async apAging(e) {
		return (await i.get("/api/v1/accounting/reports/ap-aging", { params: e })).data;
	}
}(), rt = { class: "p-6" }, it = { key: 0 }, at = { class: "mb-4 flex items-center gap-4" }, ot = {
	key: 0,
	class: "flex justify-center py-8"
}, st = { class: "font-mono" }, ct = { class: "font-mono" }, lt = { class: "mt-4 flex gap-6 text-sm font-semibold" }, ut = { class: "font-mono" }, dt = { class: "font-mono" }, ft = { class: "font-mono" }, pt = { key: 1 }, mt = { class: "mb-4 flex items-center gap-4" }, ht = {
	key: 0,
	class: "flex justify-center py-8"
}, gt = { class: "text-sm font-semibold text-heading uppercase mb-2" }, _t = { class: "w-full text-sm" }, vt = { class: "py-1 pr-4 font-mono text-muted" }, yt = { class: "py-1 pr-4 text-heading" }, bt = { class: "py-1 text-right font-mono" }, xt = { class: "font-semibold border-t-2 border-line-default" }, St = {
	class: "py-2 pr-4",
	colspan: "2"
}, Ct = { class: "py-2 text-right font-mono" }, wt = { key: 2 }, Tt = { class: "mb-4 flex items-center gap-4" }, Et = {
	key: 0,
	class: "flex justify-center py-8"
}, Dt = { class: "mb-6" }, Ot = { class: "w-full text-sm" }, kt = { class: "py-1 pr-4 font-mono text-muted" }, At = { class: "py-1 pr-4 text-heading" }, jt = { class: "py-1 text-right font-mono" }, Mt = { class: "font-semibold border-t-2 border-line-default" }, Nt = { class: "py-2 text-right font-mono" }, Pt = { class: "mb-6" }, Ft = { class: "w-full text-sm" }, It = { class: "py-1 pr-4 font-mono text-muted" }, Lt = { class: "py-1 pr-4 text-heading" }, Rt = { class: "py-1 text-right font-mono" }, zt = { class: "font-semibold border-t-2 border-line-default" }, Bt = { class: "py-2 text-right font-mono" }, Vt = { class: "text-sm font-semibold" }, Ht = { key: 3 }, Ut = { class: "mb-4 flex items-center gap-4" }, Wt = {
	key: 0,
	class: "flex justify-center py-8"
}, Gt = {
	key: 1,
	class: "text-sm space-y-2"
}, Kt = { class: "font-mono font-semibold" }, qt = { key: 4 }, Jt = { class: "mb-4 flex items-center gap-4" }, Yt = {
	key: 0,
	class: "flex justify-center py-8"
}, Xt = {
	key: 1,
	class: "text-sm"
}, Zt = { class: "font-mono font-semibold" }, Qt = { class: "mt-2 text-muted" }, $t = { key: 5 }, en = { class: "mb-4 flex items-center gap-4" }, tn = {
	key: 0,
	class: "flex justify-center py-8"
}, nn = {
	key: 1,
	class: "text-sm"
}, rn = { class: "font-mono font-semibold" }, an = { class: "mt-2 text-muted" }, on = /* @__PURE__ */ h({
	__name: "ReportLayout",
	setup(e) {
		let { formatMoney: t } = z(), n = b("trial-balance"), r = [
			{
				key: "trial-balance",
				label: "Trial Balance"
			},
			{
				key: "balance-sheet",
				label: "Balance Sheet"
			},
			{
				key: "income-statement",
				label: "Income Statement"
			},
			{
				key: "cash-flow",
				label: "Cash Flow"
			},
			{
				key: "ar-aging",
				label: "AR Aging"
			},
			{
				key: "ap-aging",
				label: "AP Aging"
			}
		], i = b((/* @__PURE__ */ new Date()).toISOString().split("T")[0]), a = b(null), o = b(!1), c = b((/* @__PURE__ */ new Date()).toISOString().split("T")[0]), h = b(null), _ = b(!1), D = b(new Date((/* @__PURE__ */ new Date()).getFullYear(), 0, 1).toISOString().split("T")[0]), O = b((/* @__PURE__ */ new Date()).toISOString().split("T")[0]), k = b(null), A = b(!1), j = b(new Date((/* @__PURE__ */ new Date()).getFullYear(), 0, 1).toISOString().split("T")[0]), M = b((/* @__PURE__ */ new Date()).toISOString().split("T")[0]), N = b(null), P = b(!1), F = b((/* @__PURE__ */ new Date()).toISOString().split("T")[0]), I = b(null), L = b(!1), R = b((/* @__PURE__ */ new Date()).toISOString().split("T")[0]), B = b(null), V = b(!1), ee = [
			{
				key: "account_code",
				label: "Code"
			},
			{
				key: "account_name",
				label: "Account"
			},
			{
				key: "debit",
				label: "Debit"
			},
			{
				key: "credit",
				label: "Credit"
			}
		];
		async function H() {
			o.value = !0;
			try {
				a.value = (await X.trialBalance({ as_of_date: i.value })).data;
			} finally {
				o.value = !1;
			}
		}
		async function U() {
			_.value = !0;
			try {
				h.value = (await X.balanceSheet({ as_of_date: c.value })).data;
			} finally {
				_.value = !1;
			}
		}
		async function W() {
			A.value = !0;
			try {
				k.value = (await X.incomeStatement({
					start_date: D.value,
					end_date: O.value
				})).data;
			} finally {
				A.value = !1;
			}
		}
		async function G() {
			P.value = !0;
			try {
				N.value = (await X.cashFlow({
					start_date: j.value,
					end_date: M.value
				})).data;
			} finally {
				P.value = !1;
			}
		}
		async function K() {
			L.value = !0;
			try {
				I.value = (await X.arAging({ as_of_date: F.value })).data;
			} finally {
				L.value = !1;
			}
		}
		async function q() {
			V.value = !0;
			try {
				B.value = (await X.apAging({ as_of_date: R.value })).data;
			} finally {
				V.value = !1;
			}
		}
		return T(n, (e) => {
			e === "trial-balance" ? H() : e === "balance-sheet" ? U() : e === "income-statement" ? W() : e === "cash-flow" ? G() : e === "ar-aging" ? K() : e === "ap-aging" && q();
		}), T(i, H), T(c, U), T([D, O], W), T([j, M], G), T(F, K), T(R, q), v(H), (e, v) => {
			let b = S("BaseBreadcrumbItem"), T = S("BaseBreadcrumb"), z = S("BasePageHeader"), H = S("BaseTabGroup"), U = S("BaseDatePicker"), W = S("BaseSpinner"), G = S("BaseTable"), K = S("BaseCard"), q = S("BasePage");
			return y(), l(q, null, {
				default: E(() => [m(z, { title: "Financial Reports" }, {
					default: E(() => [m(T, null, {
						default: E(() => [
							m(b, {
								title: "Home",
								to: "dashboard"
							}),
							m(b, {
								title: "Accounting",
								to: "modules.accounting.dashboard"
							}),
							m(b, {
								title: "Reports",
								to: "#",
								active: ""
							})
						]),
						_: 1
					})]),
					_: 1
				}), m(K, { class: "mt-6" }, {
					default: E(() => [m(H, {
						tabs: r,
						"active-tab": n.value,
						onChange: v[0] ||= (e) => n.value = e
					}, null, 8, ["active-tab"]), f("div", rt, [
						n.value === "trial-balance" ? (y(), d("div", it, [f("div", at, [m(U, {
							modelValue: i.value,
							"onUpdate:modelValue": v[1] ||= (e) => i.value = e,
							label: "As of Date"
						}, null, 8, ["modelValue"])]), o.value ? (y(), d("div", ot, [m(W)])) : a.value ? (y(), d(s, { key: 1 }, [m(G, {
							columns: ee,
							data: a.value.rows
						}, {
							"cell-debit": E(({ row: e }) => [f("span", st, C(w(t)(e.debit)), 1)]),
							"cell-credit": E(({ row: e }) => [f("span", ct, C(w(t)(e.credit)), 1)]),
							_: 1
						}, 8, ["data"]), f("div", lt, [
							f("span", null, [v[9] ||= p("Total Debits: ", -1), f("span", ut, C(w(t)(a.value.total_debits)), 1)]),
							f("span", null, [v[10] ||= p("Total Credits: ", -1), f("span", dt, C(w(t)(a.value.total_credits)), 1)]),
							f("span", { class: g(a.value.difference === 0 ? "text-status-green" : "text-status-red") }, [v[11] ||= p(" Difference: ", -1), f("span", ft, C(w(t)(a.value.difference)), 1)], 2)
						])], 64)) : u("", !0)])) : u("", !0),
						n.value === "balance-sheet" ? (y(), d("div", pt, [f("div", mt, [m(U, {
							modelValue: c.value,
							"onUpdate:modelValue": v[2] ||= (e) => c.value = e,
							label: "As of Date"
						}, null, 8, ["modelValue"])]), _.value ? (y(), d("div", ht, [m(W)])) : h.value ? (y(), d(s, { key: 1 }, x([
							"assets",
							"liabilities",
							"equity"
						], (e) => f("section", {
							key: e,
							class: "mb-6"
						}, [f("h3", gt, C(e), 1), f("table", _t, [(y(!0), d(s, null, x(h.value[e]?.items, (e) => (y(), d("tr", {
							key: e.code,
							class: "border-b border-line-light"
						}, [
							f("td", vt, C(e.code), 1),
							f("td", yt, C(e.name), 1),
							f("td", bt, C(w(t)(e.balance)), 1)
						]))), 128)), f("tr", xt, [f("td", St, "Total " + C(e), 1), f("td", Ct, C(w(t)(h.value[e]?.total)), 1)])])])), 64)) : u("", !0)])) : u("", !0),
						n.value === "income-statement" ? (y(), d("div", wt, [f("div", Tt, [m(U, {
							modelValue: D.value,
							"onUpdate:modelValue": v[3] ||= (e) => D.value = e,
							label: "From"
						}, null, 8, ["modelValue"]), m(U, {
							modelValue: O.value,
							"onUpdate:modelValue": v[4] ||= (e) => O.value = e,
							label: "To"
						}, null, 8, ["modelValue"])]), A.value ? (y(), d("div", Et, [m(W)])) : k.value ? (y(), d(s, { key: 1 }, [
							f("section", Dt, [v[13] ||= f("h3", { class: "text-sm font-semibold text-heading uppercase mb-2" }, "Revenue", -1), f("table", Ot, [(y(!0), d(s, null, x(k.value.revenues?.items, (e) => (y(), d("tr", {
								key: e.code,
								class: "border-b border-line-light"
							}, [
								f("td", kt, C(e.code), 1),
								f("td", At, C(e.name), 1),
								f("td", jt, C(w(t)(e.amount)), 1)
							]))), 128)), f("tr", Mt, [v[12] ||= f("td", {
								class: "py-2 pr-4",
								colspan: "2"
							}, "Total Revenue", -1), f("td", Nt, C(w(t)(k.value.revenues?.total)), 1)])])]),
							f("section", Pt, [v[15] ||= f("h3", { class: "text-sm font-semibold text-heading uppercase mb-2" }, "Expenses", -1), f("table", Ft, [(y(!0), d(s, null, x(k.value.expenses?.items, (e) => (y(), d("tr", {
								key: e.code,
								class: "border-b border-line-light"
							}, [
								f("td", It, C(e.code), 1),
								f("td", Lt, C(e.name), 1),
								f("td", Rt, C(w(t)(e.amount)), 1)
							]))), 128)), f("tr", zt, [v[14] ||= f("td", {
								class: "py-2 pr-4",
								colspan: "2"
							}, "Total Expenses", -1), f("td", Bt, C(w(t)(k.value.expenses?.total)), 1)])])]),
							f("div", Vt, [f("span", null, [v[16] ||= p("Net Income: ", -1), f("span", { class: g(["font-mono", k.value.net_income >= 0 ? "text-status-green" : "text-status-red"]) }, C(w(t)(k.value.net_income)), 3)])])
						], 64)) : u("", !0)])) : u("", !0),
						n.value === "cash-flow" ? (y(), d("div", Ht, [f("div", Ut, [m(U, {
							modelValue: j.value,
							"onUpdate:modelValue": v[5] ||= (e) => j.value = e,
							label: "From"
						}, null, 8, ["modelValue"]), m(U, {
							modelValue: M.value,
							"onUpdate:modelValue": v[6] ||= (e) => M.value = e,
							label: "To"
						}, null, 8, ["modelValue"])]), P.value ? (y(), d("div", Wt, [m(W)])) : N.value ? (y(), d("div", Gt, [f("p", null, [v[17] ||= p("Operating: ", -1), f("span", Kt, C(w(t)(N.value.operating?.total)), 1)]), f("p", null, [v[18] ||= p("Net Change: ", -1), f("span", { class: g(["font-mono font-semibold", N.value.net_change >= 0 ? "text-status-green" : "text-status-red"]) }, C(w(t)(N.value.net_change)), 3)])])) : u("", !0)])) : u("", !0),
						n.value === "ar-aging" ? (y(), d("div", qt, [f("div", Jt, [m(U, {
							modelValue: F.value,
							"onUpdate:modelValue": v[7] ||= (e) => F.value = e,
							label: "As of Date"
						}, null, 8, ["modelValue"])]), L.value ? (y(), d("div", Yt, [m(W)])) : I.value ? (y(), d("div", Xt, [f("p", null, [v[19] ||= p("Total AR: ", -1), f("span", Zt, C(w(t)(I.value.total_ar)), 1)]), f("p", Qt, C(I.value.rows.length) + " outstanding entries", 1)])) : u("", !0)])) : u("", !0),
						n.value === "ap-aging" ? (y(), d("div", $t, [f("div", en, [m(U, {
							modelValue: R.value,
							"onUpdate:modelValue": v[8] ||= (e) => R.value = e,
							label: "As of Date"
						}, null, 8, ["modelValue"])]), V.value ? (y(), d("div", tn, [m(W)])) : B.value ? (y(), d("div", nn, [f("p", null, [v[20] ||= p("Total AP: ", -1), f("span", rn, C(w(t)(B.value.total_ap)), 1)]), f("p", an, C(B.value.rows.length) + " outstanding entries", 1)])) : u("", !0)])) : u("", !0)
					])]),
					_: 1
				})]),
				_: 1
			});
		};
	}
}), Z = new class {
	async list() {
		return (await i.get("/api/v1/accounting/fiscal-periods")).data;
	}
	async create(e) {
		return (await i.post("/api/v1/accounting/fiscal-periods", e)).data;
	}
	async update(e, t) {
		return (await i.put(`/api/v1/accounting/fiscal-periods/${e}`, t)).data;
	}
	async close(e) {
		return (await i.post(`/api/v1/accounting/fiscal-periods/${e}/close`)).data;
	}
	async reopen(e) {
		return (await i.post(`/api/v1/accounting/fiscal-periods/${e}/reopen`)).data;
	}
}(), Q = r("accounting-fiscal-period", {
	state: () => ({
		periods: [],
		loading: !1
	}),
	actions: {
		async fetchPeriods() {
			this.loading = !0;
			try {
				this.periods = (await Z.list()).data;
			} finally {
				this.loading = !1;
			}
		},
		async createPeriod(e) {
			let t = await Z.create(e);
			return this.periods.unshift(t.data), a().showNotification({
				type: "success",
				message: "Fiscal period created"
			}), t.data;
		},
		async updatePeriod(e, t) {
			let n = await Z.update(e, t), r = this.periods.findIndex((t) => t.id === e);
			return r !== -1 && (this.periods[r] = n.data), a().showNotification({
				type: "success",
				message: "Fiscal period updated"
			}), n.data;
		},
		async closePeriod(e) {
			let t = await Z.close(e), n = this.periods.findIndex((t) => t.id === e);
			n !== -1 && (this.periods[n] = t.data), a().showNotification({
				type: "success",
				message: "Fiscal period closed"
			});
		},
		async reopenPeriod(e) {
			let t = await Z.reopen(e), n = this.periods.findIndex((t) => t.id === e);
			n !== -1 && (this.periods[n] = t.data), a().showNotification({
				type: "success",
				message: "Fiscal period reopened"
			});
		}
	}
}), sn = { class: "p-6" }, cn = {
	key: 0,
	class: "flex justify-center py-8"
}, ln = { class: "text-sm font-medium text-heading" }, un = { class: "text-sm text-muted" }, dn = { class: "flex gap-2" }, fn = /* @__PURE__ */ h({
	__name: "FiscalPeriodIndexView",
	setup(e) {
		let n = t(), r = Q(), i = o(), a = b(!0), s = c(() => r.periods), h = [
			{
				key: "name",
				label: "Name"
			},
			{
				key: "dates",
				label: "Period"
			},
			{
				key: "status",
				label: "Status"
			},
			{
				key: "actions",
				label: ""
			}
		];
		function _(e) {
			n.push({
				name: "modules.accounting.fiscal-periods.edit",
				params: { id: e.id }
			});
		}
		async function x(e) {
			await i.openDialog({
				title: "Close Period",
				message: `Close "${e.name}"? No new entries can be posted.`,
				variant: "warning"
			}) && await r.closePeriod(e.id);
		}
		async function T(e) {
			await i.openDialog({
				title: "Reopen Period",
				message: `Reopen "${e.name}"?`,
				variant: "warning"
			}) && await r.reopenPeriod(e.id);
		}
		return v(async () => {
			await r.fetchPeriods(), a.value = !1;
		}), (e, t) => {
			let r = S("BaseBreadcrumbItem"), i = S("BaseBreadcrumb"), o = S("BaseButton"), c = S("BasePageHeader"), v = S("BaseSpinner"), b = S("BaseTable"), D = S("BaseCard"), O = S("BasePage");
			return y(), l(O, null, {
				default: E(() => [m(c, { title: "Fiscal Periods" }, {
					actions: E(() => [m(o, {
						variant: "primary",
						onClick: t[0] ||= (e) => w(n).push({ name: "modules.accounting.fiscal-periods.create" })
					}, {
						default: E(() => [...t[1] ||= [p(" Add Period ", -1)]]),
						_: 1
					})]),
					default: E(() => [m(i, null, {
						default: E(() => [
							m(r, {
								title: "Home",
								to: "dashboard"
							}),
							m(r, {
								title: "Accounting",
								to: "modules.accounting.dashboard"
							}),
							m(r, {
								title: "Fiscal Periods",
								to: "#",
								active: ""
							})
						]),
						_: 1
					})]),
					_: 1
				}), m(D, { class: "mt-6" }, {
					default: E(() => [f("div", sn, [a.value ? (y(), d("div", cn, [m(v)])) : (y(), l(b, {
						key: 1,
						columns: h,
						data: s.value
					}, {
						"cell-name": E(({ row: e }) => [f("span", ln, C(e.name), 1)]),
						"cell-dates": E(({ row: e }) => [f("span", un, C(e.start_date) + " — " + C(e.end_date), 1)]),
						"cell-status": E(({ row: e }) => [f("span", { class: g(["px-2 py-1 text-sm font-normal uppercase rounded", e.is_closed ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"]) }, C(e.is_closed ? "Closed" : "Open"), 3)]),
						"cell-actions": E(({ row: e }) => [f("div", dn, [
							m(o, {
								size: "sm",
								variant: "secondary",
								onClick: (t) => _(e)
							}, {
								default: E(() => [...t[2] ||= [p("Edit", -1)]]),
								_: 1
							}, 8, ["onClick"]),
							e.is_closed ? u("", !0) : (y(), l(o, {
								key: 0,
								size: "sm",
								variant: "warning",
								onClick: (t) => x(e)
							}, {
								default: E(() => [...t[3] ||= [p("Close", -1)]]),
								_: 1
							}, 8, ["onClick"])),
							e.is_closed ? (y(), l(o, {
								key: 1,
								size: "sm",
								variant: "secondary",
								onClick: (t) => T(e)
							}, {
								default: E(() => [...t[4] ||= [p("Reopen", -1)]]),
								_: 1
							}, 8, ["onClick"])) : u("", !0)
						])]),
						_: 1
					}, 8, ["data"]))])]),
					_: 1
				})]),
				_: 1
			});
		};
	}
}), pn = { class: "p-6" }, mn = { class: "grid grid-cols-1 gap-6 md:grid-cols-2" }, hn = { class: "mt-6 flex gap-3" }, gn = /* @__PURE__ */ h({
	__name: "FiscalPeriodFormView",
	setup(e) {
		let r = t(), i = n(), a = Q(), o = c(() => !!i.params.id), s = b(!1), u = b({
			name: "",
			start_date: "",
			end_date: ""
		});
		async function d() {
			s.value = !0;
			try {
				o.value ? await a.updatePeriod(Number(i.params.id), u.value) : await a.createPeriod(u.value), r.push({ name: "modules.accounting.fiscal-periods.index" });
			} finally {
				s.value = !1;
			}
		}
		return v(async () => {
			if (a.periods.length === 0 && await a.fetchPeriods(), o.value) {
				let e = a.periods.find((e) => e.id === Number(i.params.id));
				e && (u.value = {
					name: e.name,
					start_date: e.start_date,
					end_date: e.end_date
				});
			}
		}), (e, t) => {
			let n = S("BaseBreadcrumbItem"), i = S("BaseBreadcrumb"), a = S("BasePageHeader"), c = S("BaseInput"), h = S("BaseInputGroup"), g = S("BaseDatePicker"), _ = S("BaseButton"), v = S("BaseCard"), b = S("BasePage");
			return y(), l(b, null, {
				default: E(() => [m(a, { title: o.value ? "Edit Fiscal Period" : "New Fiscal Period" }, {
					default: E(() => [m(i, null, {
						default: E(() => [
							m(n, {
								title: "Home",
								to: "dashboard"
							}),
							m(n, {
								title: "Accounting",
								to: "modules.accounting.dashboard"
							}),
							m(n, {
								title: "Fiscal Periods",
								to: "modules.accounting.fiscal-periods.index"
							}),
							m(n, {
								title: o.value ? "Edit" : "New",
								to: "#",
								active: ""
							}, null, 8, ["title"])
						]),
						_: 1
					})]),
					_: 1
				}, 8, ["title"]), m(v, { class: "mt-6" }, {
					default: E(() => [f("div", pn, [f("form", { onSubmit: D(d, ["prevent"]) }, [f("div", mn, [
						m(h, {
							label: "Period Name",
							required: ""
						}, {
							default: E(() => [m(c, {
								modelValue: u.value.name,
								"onUpdate:modelValue": t[0] ||= (e) => u.value.name = e,
								required: ""
							}, null, 8, ["modelValue"])]),
							_: 1
						}),
						t[4] ||= f("div", null, null, -1),
						m(h, {
							label: "Start Date",
							required: ""
						}, {
							default: E(() => [m(g, {
								modelValue: u.value.start_date,
								"onUpdate:modelValue": t[1] ||= (e) => u.value.start_date = e,
								required: ""
							}, null, 8, ["modelValue"])]),
							_: 1
						}),
						m(h, {
							label: "End Date",
							required: ""
						}, {
							default: E(() => [m(g, {
								modelValue: u.value.end_date,
								"onUpdate:modelValue": t[2] ||= (e) => u.value.end_date = e,
								required: ""
							}, null, 8, ["modelValue"])]),
							_: 1
						})
					]), f("div", hn, [m(_, {
						type: "submit",
						variant: "primary",
						loading: s.value
					}, {
						default: E(() => [p(C(o.value ? "Update" : "Create"), 1)]),
						_: 1
					}, 8, ["loading"]), m(_, {
						variant: "secondary",
						onClick: t[3] ||= (e) => w(r).back()
					}, {
						default: E(() => [...t[5] ||= [p("Cancel", -1)]]),
						_: 1
					})])], 32)])]),
					_: 1
				})]),
				_: 1
			});
		};
	}
}), $ = new class {
	async list() {
		return (await i.get("/api/v1/accounting/budgets")).data;
	}
	async create(e) {
		return (await i.post("/api/v1/accounting/budgets", e)).data;
	}
	async update(e, t) {
		return (await i.put(`/api/v1/accounting/budgets/${e}`, t)).data;
	}
}(), _n = r("accounting-budget", {
	state: () => ({
		budgets: [],
		loading: !1
	}),
	actions: {
		async fetchBudgets() {
			this.loading = !0;
			try {
				this.budgets = (await $.list()).data;
			} finally {
				this.loading = !1;
			}
		},
		async createBudget(e) {
			let t = await $.create(e);
			return this.budgets.unshift(t.data), a().showNotification({
				type: "success",
				message: "Budget created"
			}), t.data;
		},
		async updateBudget(e, t) {
			let n = await $.update(e, t), r = this.budgets.findIndex((t) => t.id === e);
			return r !== -1 && (this.budgets[r] = n.data), a().showNotification({
				type: "success",
				message: "Budget updated"
			}), n.data;
		}
	}
}), vn = { class: "p-6" }, yn = {
	key: 0,
	class: "flex justify-center py-8"
}, bn = {
	key: 2,
	class: "space-y-6"
}, xn = { class: "flex items-center justify-between mb-2" }, Sn = { class: "font-medium text-heading" }, Cn = { class: "ml-2 text-sm text-muted" }, wn = { class: "w-full bg-surface-secondary rounded-full h-2.5" }, Tn = { class: "mt-1 flex justify-between text-sm text-muted" }, En = /* @__PURE__ */ h({
	__name: "BudgetIndexView",
	setup(e) {
		let n = t(), r = _n(), { formatMoney: i } = z(), a = b(!0), o = c(() => r.budgets);
		function u(e) {
			n.push({
				name: "modules.accounting.budgets.edit",
				params: { id: e.id }
			});
		}
		return v(async () => {
			await r.fetchBudgets(), a.value = !1;
		}), (e, t) => {
			let r = S("BaseBreadcrumbItem"), c = S("BaseBreadcrumb"), h = S("BaseButton"), v = S("BasePageHeader"), b = S("BaseSpinner"), T = S("BaseEmptyPlaceholder"), D = S("BaseCard"), O = S("BasePage");
			return y(), l(O, null, {
				default: E(() => [m(v, { title: "Budgets" }, {
					actions: E(() => [m(h, {
						variant: "primary",
						onClick: t[0] ||= (e) => w(n).push({ name: "modules.accounting.budgets.create" })
					}, {
						default: E(() => [...t[1] ||= [p(" Add Budget ", -1)]]),
						_: 1
					})]),
					default: E(() => [m(c, null, {
						default: E(() => [
							m(r, {
								title: "Home",
								to: "dashboard"
							}),
							m(r, {
								title: "Accounting",
								to: "modules.accounting.dashboard"
							}),
							m(r, {
								title: "Budgets",
								to: "#",
								active: ""
							})
						]),
						_: 1
					})]),
					_: 1
				}), m(D, { class: "mt-6" }, {
					default: E(() => [f("div", vn, [a.value ? (y(), d("div", yn, [m(b)])) : o.value.length === 0 ? (y(), l(T, {
						key: 1,
						title: "No budgets yet",
						description: "Create a budget to track spending against targets."
					})) : (y(), d("div", bn, [(y(!0), d(s, null, x(o.value, (e) => (y(), d("div", {
						key: e.id,
						class: "rounded-lg border border-line-default p-4"
					}, [
						f("div", xn, [f("div", null, [f("span", Sn, C(e.account_code) + " — " + C(e.account_name), 1), f("span", Cn, "(" + C(e.fiscal_period_name) + ")", 1)]), m(h, {
							size: "sm",
							variant: "secondary",
							onClick: (t) => u(e)
						}, {
							default: E(() => [...t[2] ||= [p("Edit", -1)]]),
							_: 1
						}, 8, ["onClick"])]),
						f("div", wn, [f("div", {
							class: g(["h-2.5 rounded-full transition-all duration-300", e.percentage > 100 ? "bg-status-red" : e.percentage > 80 ? "bg-status-yellow" : "bg-primary-500"]),
							style: _({ width: Math.min(e.percentage, 100) + "%" })
						}, null, 6)]),
						f("div", Tn, [f("span", null, C(w(i)(e.spent_amount)) + " spent", 1), f("span", null, C(w(i)(e.amount)) + " budgeted", 1)])
					]))), 128))]))])]),
					_: 1
				})]),
				_: 1
			});
		};
	}
}), Dn = { class: "p-6" }, On = { class: "grid grid-cols-1 gap-6 md:grid-cols-2" }, kn = { class: "mt-6 flex gap-3" }, An = /* @__PURE__ */ h({
	__name: "BudgetFormView",
	setup(e) {
		let r = t(), i = n(), a = _n(), o = P(), s = Q(), u = c(() => !!i.params.id), d = b(!1), h = b({
			fiscal_period_id: null,
			account_id: null,
			amount: 0
		}), g = c(() => s.periods.map((e) => ({
			value: e.id,
			label: e.name
		}))), _ = c(() => o.accounts.map((e) => ({
			value: e.id,
			label: `[${e.code}] ${e.name}`
		})));
		async function x() {
			d.value = !0;
			try {
				let e = {
					...h.value,
					amount: Math.round(Number(h.value.amount) * 100)
				};
				u.value ? await a.updateBudget(Number(i.params.id), e) : await a.createBudget(e), r.push({ name: "modules.accounting.budgets.index" });
			} finally {
				d.value = !1;
			}
		}
		return v(async () => {
			if (await Promise.all([o.accounts.length === 0 ? o.fetchAccounts() : Promise.resolve(), s.periods.length === 0 ? s.fetchPeriods() : Promise.resolve()]), u.value) {
				let e = a.budgets.find((e) => e.id === Number(i.params.id));
				e && (h.value = {
					fiscal_period_id: e.fiscal_period_id,
					account_id: e.account_id,
					amount: e.amount / 100
				});
			}
		}), (e, t) => {
			let n = S("BaseBreadcrumbItem"), i = S("BaseBreadcrumb"), a = S("BasePageHeader"), o = S("BaseSelectInput"), s = S("BaseInputGroup"), c = S("BaseInput"), v = S("BaseButton"), b = S("BaseCard"), T = S("BasePage");
			return y(), l(T, null, {
				default: E(() => [m(a, { title: u.value ? "Edit Budget" : "New Budget" }, {
					default: E(() => [m(i, null, {
						default: E(() => [
							m(n, {
								title: "Home",
								to: "dashboard"
							}),
							m(n, {
								title: "Accounting",
								to: "modules.accounting.dashboard"
							}),
							m(n, {
								title: "Budgets",
								to: "modules.accounting.budgets.index"
							}),
							m(n, {
								title: u.value ? "Edit" : "New",
								to: "#",
								active: ""
							}, null, 8, ["title"])
						]),
						_: 1
					})]),
					_: 1
				}, 8, ["title"]), m(b, { class: "mt-6" }, {
					default: E(() => [f("div", Dn, [f("form", { onSubmit: D(x, ["prevent"]) }, [f("div", On, [
						m(s, {
							label: "Fiscal Period",
							required: ""
						}, {
							default: E(() => [m(o, {
								modelValue: h.value.fiscal_period_id,
								"onUpdate:modelValue": t[0] ||= (e) => h.value.fiscal_period_id = e,
								options: g.value,
								required: ""
							}, null, 8, ["modelValue", "options"])]),
							_: 1
						}),
						m(s, {
							label: "Account",
							required: ""
						}, {
							default: E(() => [m(o, {
								modelValue: h.value.account_id,
								"onUpdate:modelValue": t[1] ||= (e) => h.value.account_id = e,
								options: _.value,
								required: ""
							}, null, 8, ["modelValue", "options"])]),
							_: 1
						}),
						m(s, {
							label: "Budget Amount",
							required: ""
						}, {
							default: E(() => [m(c, {
								modelValue: h.value.amount,
								"onUpdate:modelValue": t[2] ||= (e) => h.value.amount = e,
								type: "number",
								min: "0",
								step: "0.01",
								required: ""
							}, null, 8, ["modelValue"])]),
							_: 1
						})
					]), f("div", kn, [m(v, {
						type: "submit",
						variant: "primary",
						loading: d.value
					}, {
						default: E(() => [p(C(u.value ? "Update" : "Create"), 1)]),
						_: 1
					}, 8, ["loading"]), m(v, {
						variant: "secondary",
						onClick: t[3] ||= (e) => w(r).back()
					}, {
						default: E(() => [...t[4] ||= [p("Cancel", -1)]]),
						_: 1
					})])], 32)])]),
					_: 1
				})]),
				_: 1
			});
		};
	}
});
//#endregion
//#region resources/js/init.ts
window.InvoiceShelf.booting((e, t) => {
	let n = {
		requiresAuth: !0,
		ability: "manage-accounting"
	};
	t.addRoute("admin", {
		path: "modules/accounting/dashboard",
		name: "modules.accounting.dashboard",
		component: M,
		meta: { requiresAuth: !0 }
	}), t.addRoute("admin", {
		path: "modules/accounting/accounts",
		name: "modules.accounting.accounts.index",
		component: W,
		meta: n
	}), t.addRoute("admin", {
		path: "modules/accounting/accounts/create",
		name: "modules.accounting.accounts.create",
		component: ne,
		meta: n
	}), t.addRoute("admin", {
		path: "modules/accounting/accounts/:id",
		name: "modules.accounting.accounts.show",
		component: pe,
		meta: n
	}), t.addRoute("admin", {
		path: "modules/accounting/accounts/:id/edit",
		name: "modules.accounting.accounts.edit",
		component: ne,
		meta: n
	}), t.addRoute("admin", {
		path: "modules/accounting/journal-entries",
		name: "modules.accounting.journal-entries.index",
		component: ve,
		meta: n
	}), t.addRoute("admin", {
		path: "modules/accounting/journal-entries/create",
		name: "modules.accounting.journal-entries.create",
		component: Ie,
		meta: n
	}), t.addRoute("admin", {
		path: "modules/accounting/journal-entries/:id",
		name: "modules.accounting.journal-entries.show",
		component: nt,
		meta: n
	}), t.addRoute("admin", {
		path: "modules/accounting/reports",
		name: "modules.accounting.reports",
		component: on,
		meta: n
	}), t.addRoute("admin", {
		path: "modules/accounting/fiscal-periods",
		name: "modules.accounting.fiscal-periods.index",
		component: fn,
		meta: n
	}), t.addRoute("admin", {
		path: "modules/accounting/fiscal-periods/create",
		name: "modules.accounting.fiscal-periods.create",
		component: gn,
		meta: n
	}), t.addRoute("admin", {
		path: "modules/accounting/fiscal-periods/:id/edit",
		name: "modules.accounting.fiscal-periods.edit",
		component: gn,
		meta: n
	}), t.addRoute("admin", {
		path: "modules/accounting/budgets",
		name: "modules.accounting.budgets.index",
		component: En,
		meta: n
	}), t.addRoute("admin", {
		path: "modules/accounting/budgets/create",
		name: "modules.accounting.budgets.create",
		component: An,
		meta: n
	}), t.addRoute("admin", {
		path: "modules/accounting/budgets/:id/edit",
		name: "modules.accounting.budgets.edit",
		component: An,
		meta: n
	});
});
//#endregion
