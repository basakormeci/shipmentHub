import type { ReactNode } from 'react'
import { CARRIER_METRIC_KEYS, CARRIER_METRIC_LABELS, getCompany, type ShipmentRoutingDecision } from '../../data/catalog'

type TFunc = (key: string, vars?: Record<string, string | number>) => string

/** Collapsed-row summary fields for the "Rotalama" DetailSection header — shared by the
 * shipment/return/transfer detail pages so the wording never drifts between them. */
export function routingSummaryFields(routing: ShipmentRoutingDecision | undefined, t: TFunc): { label: string; value: ReactNode }[] {
  if (!routing) {
    return [{ label: '', value: <span className="text-neutral-400">{t('shipmentDetail.routing_legacy')}</span> }]
  }
  if (routing.mode === 'manual') {
    return [{ label: t('shipmentDetail.field_routing_mode'), value: <span className="font-semibold">{t('shipmentDetail.routing_mode_manual')}</span> }]
  }
  return [
    { label: t('shipmentDetail.field_routing_mode'), value: <span className="font-semibold">{t('shipmentDetail.routing_mode_auto')}</span> },
    { label: '', value: t('shipmentDetail.routing_default_scoring') },
  ]
}

/** The full step-by-step breakdown of an 'auto' routing decision: 1) contract eligibility
 * (which carriers matched this package's desi/amount/region/product-type), 2) routing-rule
 * filtering (exclusions removed, then an include rule may narrow further), 3) the weighted
 * normalized score table for whatever's left, 4) the winning carrier. Shared verbatim by the
 * shipment/return/transfer detail pages' "Rotalama" section. */
export function RoutingDecisionSteps({ routing, t }: { routing: ShipmentRoutingDecision; t: TFunc }) {
  // Defensive against stale persisted decisions saved before excludedCompanyIds/
  // excludedByRuleNames/contractEligibleCompanyIds/scores existed on the shape.
  const eligibleIds = routing.contractEligibleCompanyIds ?? []
  const excludedIds = routing.excludedCompanyIds ?? []
  const excludedNames = routing.excludedByRuleNames ?? []
  const scores = routing.scores ?? []

  const eligibleNames = eligibleIds
    .map((id) => getCompany(id)?.name)
    .filter(Boolean)
    .join(', ')

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
          1. {t('shipmentDetail.routing_step_eligibility')}
        </p>
        <p className="text-xs text-neutral-600">{t('shipmentDetail.routing_step_eligibility_desc', { n: eligibleIds.length })}</p>
        {eligibleNames ? (
          <p className="text-xs text-neutral-500 mt-1">{t('shipmentDetail.routing_step_eligibility_names', { names: eligibleNames })}</p>
        ) : null}
      </div>

      <div>
        <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">2. {t('shipmentDetail.routing_step_rule')}</p>
        <div className="flex flex-col gap-1">
          {excludedIds.length > 0 ? (
            <p className="text-xs text-neutral-600">
              {t('shipmentDetail.routing_step_exclude_desc', { n: excludedIds.length, names: excludedNames.join(', ') })}
            </p>
          ) : null}
          {routing.matchedRuleName ? (
            <p className="text-xs text-neutral-600">
              {t('shipmentDetail.routing_step_rule_matched', { name: routing.matchedRuleName, summary: routing.matchedRuleSummary ?? '' })}
              {routing.ruleNarrowedCompanyIds
                ? ' ' + t('shipmentDetail.routing_step_rule_narrowed', { n: routing.ruleNarrowedCompanyIds.length })
                : ''}
            </p>
          ) : null}
          {!routing.matchedRuleName && excludedIds.length === 0 ? (
            <p className="text-xs text-neutral-400">{t('shipmentDetail.routing_step_rule_none')}</p>
          ) : null}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
          3. {t('shipmentDetail.routing_step_scoring')}
        </p>
        <div className="bg-white border border-neutral-200 rounded-lg overflow-x-auto">
          <table className="w-full text-xs" style={{ minWidth: 640 }}>
            <thead>
              <tr className="border-b border-neutral-100 text-left">
                <th className="px-3 py-2 text-neutral-400 font-semibold uppercase tracking-wider">{t('shipmentDetail.routing_th_carrier')}</th>
                {CARRIER_METRIC_KEYS.map((k) => (
                  <th key={k} className="px-2 py-2 text-neutral-400 font-semibold uppercase tracking-wider text-right whitespace-nowrap">
                    {CARRIER_METRIC_LABELS[k]}
                    <span className="block font-normal normal-case text-neutral-300">%{Math.round((routing.weights?.[k] ?? 0) * 100)}</span>
                  </th>
                ))}
                <th className="px-3 py-2 text-neutral-400 font-semibold uppercase tracking-wider text-right">{t('shipmentDetail.routing_th_score')}</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((s) => (
                <tr key={s.companyId} className={s.companyId === routing.chosenCompanyId ? 'bg-primary-lighter/30' : ''}>
                  <td className="px-3 py-2 font-medium text-neutral-700 whitespace-nowrap">
                    {s.companyName}
                    {s.companyId === routing.chosenCompanyId ? (
                      <span className="ml-1.5 text-primary text-[10px] font-semibold">{t('shipmentDetail.routing_chosen')}</span>
                    ) : null}
                  </td>
                  {CARRIER_METRIC_KEYS.map((k) => (
                    <td key={k} className="px-2 py-2 text-right text-neutral-500">
                      {((s.metrics?.[k] ?? 0) * 100).toFixed(0)}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right font-semibold text-neutral-800">{((s.combined ?? 0) * 100).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">4. {t('shipmentDetail.routing_step_result')}</p>
        <p className="text-xs text-neutral-600">
          {t('shipmentDetail.routing_step_result_desc', { name: getCompany(routing.chosenCompanyId)?.name ?? '' })}
        </p>
      </div>
    </div>
  )
}
