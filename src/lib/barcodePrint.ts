import { getCompany, type Shipment } from '../data/catalog'

export interface BarcodeLabelItem {
  companyName: string
  docNo: string
  trackingNo: string
  from: string
  to: string
  address: string
}

export function shipmentBarcodeLabel(shipment: Shipment): BarcodeLabelItem {
  const co = getCompany(shipment.companyId)
  return {
    companyName: co?.name ?? '—',
    docNo: `#${shipment.shipmentNo}`,
    trackingNo: shipment.trackingNo,
    from: shipment.shipFrom,
    to: shipment.customerName,
    address: `${shipment.shipTo.district} / ${shipment.shipTo.province}`,
  }
}

function buildLabelHtml(items: BarcodeLabelItem[]): string {
  const labels = items
    .map(
      (it) => `
    <div class="label">
      <div class="company">${escapeHtml(it.companyName)}</div>
      <div class="row"><span>${escapeHtml(it.docNo)}</span><span class="tag">ETİKET</span></div>
      <div class="barcode"></div>
      <div class="track">${escapeHtml(it.trackingNo)}</div>
      <hr>
      <div class="section-title">Gönderen</div>
      <div class="addr">${escapeHtml(it.from)}</div>
      <hr>
      <div class="section-title">Alıcı</div>
      <div class="addr">${escapeHtml(it.to)}</div>
      <div class="addr2">${escapeHtml(it.address)}</div>
    </div>`,
    )
    .join('')

  return `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><title>Kargo Etiketi</title>
<style>
  body{font-family:Arial,Helvetica,sans-serif;background:#f2f2f3;margin:0;padding:24px;}
  .toolbar{max-width:420px;margin:0 auto 16px;text-align:right;}
  .toolbar button{padding:9px 16px;border-radius:10px;border:none;background:#1fc16b;color:#fff;font-weight:600;font-size:13px;cursor:pointer;}
  .label{max-width:420px;margin:0 auto 24px;background:#fff;border:2px solid #111;border-radius:10px;padding:22px;}
  .row{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;font-size:13px;color:#333;}
  .tag{background:#ebf1ff;color:#2547d0;font-size:10px;font-weight:700;letter-spacing:.04em;padding:2px 8px;border-radius:999px;}
  .company{font-size:19px;font-weight:800;margin-bottom:6px;}
  .barcode{height:70px;margin:16px 0 8px;background:repeating-linear-gradient(90deg,#000 0 2px,#fff 2px 4px,#000 4px 7px,#fff 7px 8px,#000 8px 11px,#fff 11px 14px,#000 14px 15px,#fff 15px 18px,#000 18px 21px,#fff 21px 23px);}
  .track{text-align:center;font-family:Menlo,monospace;font-size:13px;letter-spacing:2px;margin-bottom:8px;color:#111;}
  .section-title{font-size:10px;text-transform:uppercase;color:#888;letter-spacing:.06em;margin-bottom:2px;margin-top:10px;}
  .addr{font-size:14px;font-weight:700;color:#111;}
  .addr2{font-size:13px;color:#444;}
  hr{border:none;border-top:1px dashed #bbb;margin:12px 0 0;}
  @media print { body{background:#fff;padding:0;} .toolbar{display:none;} .label{border:2px solid #000;box-shadow:none;margin-bottom:0;page-break-after:always;} }
</style></head>
<body>
  <div class="toolbar"><button type="button" onclick="window.print()">Yazdır</button></div>
  ${labels}
</body></html>`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Opens a printable label window for one or more shipments. */
export function openShipmentBarcodePrint(shipments: Shipment[]): void {
  if (shipments.length === 0) return
  const html = buildLabelHtml(shipments.map(shipmentBarcodeLabel))
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank', 'noopener,noreferrer')
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
