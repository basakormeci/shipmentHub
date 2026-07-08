import { getProvince, PROVINCES, type ContractForm, type CoveredRegion } from '../../data/catalog'
import { useT } from '../../hooks/useT'
import { SearchInput } from '../../components/ui/SearchInput'

function ChkBox({ full, partial }: { full: boolean; partial: boolean }) {
  if (full) {
    return (
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          background: '#1fc16b',
          border: '2px solid #1fc16b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1.5 5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    )
  }
  if (partial) {
    return (
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          background: '#e3f7ec',
          border: '2px solid #1fc16b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <div style={{ width: 8, height: 2, background: '#1fc16b', borderRadius: 1 }} />
      </div>
    )
  }
  return (
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: 4,
        background: 'white',
        border: '1.5px solid #eaecf0',
        flexShrink: 0,
      }}
    />
  )
}

function coverage(regions: CoveredRegion[], provId: number) {
  return regions.find((r) => r.provinceId === provId)
}

function isFull(c: CoveredRegion | undefined) {
  return !!c && c.districts.length === 0
}

function isPartial(c: CoveredRegion | undefined) {
  return !!c && c.districts.length > 0
}

export function ContractStep2({ f, onChange }: { f: ContractForm; onChange: (patch: Partial<ContractForm>) => void }) {
  const t = useT()
  const search = (f.search2 || '').toLowerCase().trim()
  const isSearching = search.length > 0
  const activeProv = f.activeProvinceId2 ? getProvince(+f.activeProvinceId2) : undefined

  let totalProv = 0
  let totalDist = 0
  f.coveredRegions.forEach((r) => {
    totalProv++
    const p = getProvince(r.provinceId)
    totalDist += r.districts.length === 0 ? (p ? p.districts.length : 0) : r.districts.length
  })
  const hasSel = f.coveredRegions.length > 0
  const allProvsSelected =
    f.coveredRegions.length === PROVINCES.length && f.coveredRegions.every((r) => r.districts.length === 0)

  function setRegions(regions: CoveredRegion[]) {
    onChange({ coveredRegions: regions })
  }

  function toggleProvince(provId: number) {
    const prov = getProvince(provId)
    if (!prov) return
    const idx = f.coveredRegions.findIndex((r) => r.provinceId === provId)
    if (idx >= 0) {
      setRegions(f.coveredRegions.filter((r) => r.provinceId !== provId))
    } else {
      setRegions([...f.coveredRegions, { provinceId: provId, provinceName: prov.name, districts: [] }])
    }
  }

  function toggleDistrict(provId: number, districtName: string) {
    const prov = getProvince(provId)
    if (!prov) return
    const idx = f.coveredRegions.findIndex((r) => r.provinceId === provId)
    const next = [...f.coveredRegions]

    if (idx < 0) {
      next.push({ provinceId: provId, provinceName: prov.name, districts: [districtName] })
    } else {
      const entry = { ...next[idx], districts: [...next[idx].districts] }
      if (entry.districts.length === 0) {
        entry.districts = prov.districts.filter((d) => d !== districtName)
        if (entry.districts.length === 0) {
          setRegions(next.filter((r) => r.provinceId !== provId))
          onChange({ activeProvinceId2: provId })
          return
        }
      } else {
        const dIdx = entry.districts.indexOf(districtName)
        if (dIdx >= 0) {
          entry.districts.splice(dIdx, 1)
          if (entry.districts.length === 0) {
            setRegions(next.filter((r) => r.provinceId !== provId))
            onChange({ activeProvinceId2: provId })
            return
          }
        } else {
          entry.districts.push(districtName)
          if (entry.districts.length === prov.districts.length) entry.districts = []
        }
      }
      next[idx] = entry
    }
    setRegions(next)
    onChange({ activeProvinceId2: provId })
  }

  function toggleAllProvinces() {
    setRegions(
      allProvsSelected ? [] : PROVINCES.map((p) => ({ provinceId: p.id, provinceName: p.name, districts: [] })),
    )
  }

  function toggleAllDistricts(provId: number) {
    const prov = getProvince(provId)
    if (!prov) return
    const idx = f.coveredRegions.findIndex((r) => r.provinceId === provId)
    const next = [...f.coveredRegions]
    if (idx < 0) {
      next.push({ provinceId: provId, provinceName: prov.name, districts: [] })
    } else {
      const entry = next[idx]
      if (entry.districts.length === 0) {
        setRegions(next.filter((r) => r.provinceId !== provId))
        return
      }
      next[idx] = { ...entry, districts: [] }
    }
    setRegions(next)
  }

  const searchHits: Array<
    | { type: 'province'; prov: (typeof PROVINCES)[number]; checked: boolean; full: boolean; partial: boolean }
    | { type: 'district'; prov: (typeof PROVINCES)[number]; name: string; checked: boolean }
  > = []

  if (isSearching) {
    PROVINCES.forEach((p) => {
      const c = coverage(f.coveredRegions, p.id)
      if (p.name.toLowerCase().includes(search)) {
        searchHits.push({ type: 'province', prov: p, checked: !!c, full: isFull(c), partial: isPartial(c) })
      }
      p.districts.forEach((d) => {
        if (d.toLowerCase().includes(search)) {
          const distChecked = isFull(c) || !!(c && c.districts.includes(d))
          searchHits.push({ type: 'district', prov: p, name: d, checked: distChecked })
        }
      })
    })
  }

  const activeCoverage = activeProv ? coverage(f.coveredRegions, activeProv.id) : undefined
  const activeAllSel =
    activeCoverage &&
    (isFull(activeCoverage) || activeCoverage.districts.length === activeProv!.districts.length)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <SearchInput
        placeholder={t('step2.search_placeholder')}
        value={f.search2}
        onChange={(e) => onChange({ search2: e.target.value })}
      />

      {isSearching ? (
        <div style={{ border: '1px solid #eaecf0', borderRadius: 12, maxHeight: 300, overflowY: 'auto' }}>
          {searchHits.length === 0 ? (
            <div style={{ padding: '28px 16px', textAlign: 'center', color: '#99a0ae', fontSize: 13 }}>{t('step2.no_results')}</div>
          ) : (
            searchHits.map((h, i) =>
              h.type === 'province' ? (
                <div
                  key={`p-${h.prov.id}`}
                  onClick={() => toggleProvince(h.prov.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '9px 14px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f2f5f8',
                  }}
                  className="hover:bg-neutral-50"
                >
                  <ChkBox full={h.full} partial={h.partial} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 500, color: '#0e121b' }}>{h.prov.name}</div>
                    <div style={{ fontSize: '11.5px', color: '#99a0ae' }}>{t('step2.district_count', { n: h.prov.districts.length })}</div>
                  </div>
                  {h.full ? (
                    <span style={{ fontSize: 11, fontWeight: 500, color: '#1fc16b', background: '#e3f7ec', padding: '2px 8px', borderRadius: 999 }}>
                      {t('step2.province_badge')}
                    </span>
                  ) : null}
                </div>
              ) : (
                <div
                  key={`d-${h.prov.id}-${h.name}-${i}`}
                  onClick={() => toggleDistrict(h.prov.id, h.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '9px 14px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f2f5f8',
                  }}
                  className="hover:bg-neutral-50"
                >
                  <ChkBox full={h.checked} partial={false} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 500, color: '#0e121b' }}>{h.name}</div>
                    <div style={{ fontSize: '11.5px', color: '#99a0ae' }}>{h.prov.name}</div>
                  </div>
                </div>
              ),
            )
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, height: 296 }}>
          <div style={{ border: '1px solid #eaecf0', borderRadius: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px 6px 12px', borderBottom: '1px solid #f2f5f8', background: '#f5f7fa', flexShrink: 0 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: '#99a0ae' }}>
                {t('step2.provinces_header')}
              </span>
              <button
                type="button"
                onClick={toggleAllProvinces}
                style={{ fontSize: '11.5px', fontWeight: 500, color: '#1fc16b', background: 'transparent', border: 'none', cursor: 'pointer', padding: '3px 6px', borderRadius: 6, fontFamily: 'inherit' }}
              >
                {allProvsSelected ? t('step2.deselect_all') : t('step2.select_all')}
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 4 }}>
              {PROVINCES.map((p) => {
                const c = coverage(f.coveredRegions, p.id)
                const full = isFull(c)
                const partial = isPartial(c)
                const isActive = f.activeProvinceId2 == p.id
                const countText = full
                  ? t('step2.district_count', { n: p.districts.length })
                  : partial
                    ? `${c!.districts.length}/${p.districts.length}`
                    : ''
                return (
                  <div
                    key={p.id}
                    onClick={() => onChange({ activeProvinceId2: p.id })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 10px',
                      cursor: 'pointer',
                      borderRadius: 8,
                      background: isActive ? '#ebf1ff' : undefined,
                    }}
                    className={isActive ? '' : 'hover:bg-neutral-50'}
                  >
                    <ChkBox full={full} partial={partial} />
                    <div
                      style={{
                        fontSize: 13,
                        flex: 1,
                        color: isActive ? '#1f3bad' : '#0e121b',
                        fontWeight: isActive ? 600 : 400,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {p.name}
                    </div>
                    {countText ? <span style={{ fontSize: '11.5px', color: '#525866', flexShrink: 0 }}>{countText}</span> : null}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: isActive ? '#1fc16b' : '#cacfd8', flexShrink: 0 }}>
                      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ border: '1px solid #eaecf0', borderRadius: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px 6px 12px', borderBottom: '1px solid #f2f5f8', background: '#f5f7fa', flexShrink: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0e121b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeProv ? activeProv.name : t('step2.districts_header')}
              </span>
              {activeProv ? (
                <button
                  type="button"
                  onClick={() => toggleAllDistricts(activeProv.id)}
                  style={{ fontSize: '11.5px', fontWeight: 500, color: '#1fc16b', background: 'transparent', border: 'none', cursor: 'pointer', padding: '3px 6px', borderRadius: 6, fontFamily: 'inherit', flexShrink: 0 }}
                >
                  {activeAllSel ? t('step2.deselect_all') : t('step2.select_all')}
                </button>
              ) : null}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 4 }}>
              {activeProv ? (
                activeProv.districts.map((d) => {
                  const c = coverage(f.coveredRegions, activeProv.id)
                  const checked = isFull(c) || !!(c && c.districts.includes(d))
                  return (
                    <div
                      key={d}
                      onClick={() => toggleDistrict(activeProv.id, d)}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', cursor: 'pointer', borderRadius: 8 }}
                      className="hover:bg-neutral-50"
                    >
                      <ChkBox full={checked} partial={false} />
                      <span style={{ fontSize: 13, color: '#0e121b' }}>{d}</span>
                    </div>
                  )
                })
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#cacfd8', textAlign: 'center', padding: 16 }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 8 }}>
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: '12.5px' }}>{t('step2.select_province_prompt')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: '#99a0ae' }}>
            {t('step2.covered_regions')}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: '#525866' }}>
              {t('step2.coverage_summary', { provinces: totalProv, districts: totalDist })}
            </span>
            {hasSel ? (
              <button
                type="button"
                onClick={() => setRegions([])}
                style={{ fontSize: '11.5px', fontWeight: 500, color: '#fb3748', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
              >
                {t('step2.clear')}
              </button>
            ) : null}
          </div>
        </div>
        {hasSel ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 76, overflowY: 'auto' }}>
            {f.coveredRegions.map((r) => {
              const label =
                r.districts.length === 0
                  ? r.provinceName
                  : r.districts.length === 1
                    ? `${r.provinceName} · ${r.districts[0]}`
                    : `${r.provinceName} · ${t('step2.district_count', { n: r.districts.length })}`
              return (
                <div
                  key={r.provinceId}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#f2f5f8',
                    border: '1px solid #eaecf0',
                    borderRadius: 999,
                    padding: '4px 6px 4px 11px',
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#0e121b', whiteSpace: 'nowrap' }}>{label}</span>
                  <button
                    type="button"
                    onClick={() => setRegions(f.coveredRegions.filter((x) => x.provinceId !== r.provinceId))}
                    style={{ width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#99a0ae', border: 'none', background: 'transparent' }}
                    className="hover:bg-[#ffebec] hover:text-[#fb3748]"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ fontSize: '12.5px', color: '#99a0ae', padding: '4px 0' }}>{t('step2.no_region_selected')}</div>
        )}
      </div>
    </div>
  )
}
