import { PROVINCES, BARCODE_FORMATS, getCompany, type ReturnItem, type Shipment, type TransferItem } from '../data/catalog'
import { packageItemsFor } from './shipments'
import { getNode } from './transfers'
import type { StockNode } from '../data/seed'

/** Common shape both Shipment and ReturnItem carry — every label renderer below only needs
 * these fields, so either can be printed through the same carrier-specific templates. */
export interface PrintableParcel {
  id: number
  docNo: number
  orderNo: number
  companyId: number
  trackingNo: string
  shipFrom: string
  shipTo: { district: string; province: string }
  shipTime: string
  referenceId: string
  packageNo: string
  customerName: string
  channel: string
  desi?: number
}

function parcelFromShipment(s: Shipment): PrintableParcel {
  return {
    id: s.id,
    docNo: s.shipmentNo,
    orderNo: s.orderNo,
    companyId: s.companyId,
    trackingNo: s.trackingNo,
    shipFrom: s.shipFrom,
    shipTo: s.shipTo,
    shipTime: s.shipTime,
    referenceId: s.referenceId,
    packageNo: s.packageNo,
    customerName: s.customerName,
    channel: s.channel,
    desi: s.desi,
  }
}

function parcelFromReturn(r: ReturnItem): PrintableParcel {
  return {
    id: r.id,
    docNo: r.returnNo,
    orderNo: r.orderNo,
    companyId: r.companyId,
    trackingNo: r.trackingNo,
    shipFrom: r.shipFrom,
    shipTo: r.shipTo,
    shipTime: r.requestDate,
    referenceId: r.referenceId,
    packageNo: r.packageNo,
    customerName: r.customerName,
    channel: r.channel,
    desi: r.desi,
  }
}

function parcelFromTransfer(tr: TransferItem, nodes: StockNode[]): PrintableParcel {
  const from = getNode(nodes, tr.fromNodeId)
  const to = getNode(nodes, tr.toNodeId)
  const toProvince = to?.provinceId != null ? PROVINCES.find((p) => p.id === to.provinceId)?.name : undefined
  return {
    id: tr.id,
    docNo: tr.transferNo,
    orderNo: tr.dispatchNo,
    companyId: tr.companyId,
    trackingNo: tr.trackingNo,
    shipFrom: from ? from.name : '-',
    shipTo: { district: to ? to.name : '-', province: toProvince ?? (to ? to.name : '-') },
    shipTime: tr.createdAt,
    referenceId: tr.referenceId,
    packageNo: tr.packageNo,
    customerName: to ? to.name : '-',
    channel: 'Transfer',
    desi: tr.desi,
  }
}

export interface BarcodeLabelItem {
  companyName: string
  docNo: string
  trackingNo: string
  from: string
  to: string
  address: string
}

function parcelBarcodeLabel(p: PrintableParcel): BarcodeLabelItem {
  const co = getCompany(p.companyId)
  return {
    companyName: co?.name ?? '—',
    docNo: `#${p.docNo}`,
    trackingNo: p.trackingNo,
    from: p.shipFrom,
    to: p.customerName,
    address: `${p.shipTo.district} / ${p.shipTo.province}`,
  }
}

// ---- Deterministic synthetic fields (same hashing style as desiKgFor/packageItemsFor) ----
// The real carrier labels below embed internal codes (project/route/branch ids, VAT numbers,
// agreement numbers…) this app has no source of truth for — these are seeded from the
// shipment id so a given shipment always renders the same plausible values.

const PLATE_CODE: Record<string, string> = {
  İstanbul: '34',
  Ankara: '06',
  İzmir: '35',
  Bursa: '16',
  Antalya: '07',
  Adana: '01',
  Konya: '42',
  Gaziantep: '27',
  Trabzon: '61',
  Van: '65',
  Diyarbakır: '21',
  Kayseri: '38',
}

function plateCodeFor(province: string): string {
  return PLATE_CODE[province] ?? '00'
}

function pad(n: number, len: number): string {
  return String(Math.abs(Math.trunc(n))).padStart(len, '0')
}

function totalQtyFor(id: number): number {
  return packageItemsFor(id).reduce((sum, it) => sum + it.qty, 0)
}

function desiFor(id: number): number {
  return 3 + ((id * 7) % 25)
}

function printDate(shipTime: string): { date: string; time: string } {
  const d = new Date(shipTime)
  return {
    date: d.toLocaleDateString('tr-TR'),
    time: d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** CSS-faked barcode (same visual trick as the generic label) and a checkerboard QR stand-in —
 * this prototype never needed a scannable code, only a visually plausible one. */
const FAKE_BARCODE_BG =
  'repeating-linear-gradient(90deg,#000 0 2px,#fff 2px 4px,#000 4px 7px,#fff 7px 8px,#000 8px 11px,#fff 11px 14px,#000 14px 15px,#fff 15px 18px,#000 18px 21px,#fff 21px 23px)'
const FAKE_QR_BG =
  'repeating-conic-gradient(#000 0deg 90deg,#fff 90deg 180deg) 0 0/8px 8px, repeating-conic-gradient(#000 0deg 90deg,#fff 90deg 180deg) 4px 4px/8px 8px'

// ---- Yurtiçi Kargo ----
function renderYurticiLabel(s: PrintableParcel, companyName: string): string {
  const qty = totalQtyFor(s.id)
  return `
    <div class="label ycl ycl-yurtici">
      <div class="ycl-title">YURTİÇİNEW KARGO ETİKETİ</div>
      <div class="ycl-barcode"></div>
      <div class="ycl-barcode-no">${escapeHtml(s.trackingNo)}</div>
      <div class="ycl-ref-label">REFERENCE ID:</div>
      <div class="ycl-ref-val">${escapeHtml(s.trackingNo)}</div>
      <div class="ycl-ref-label">PROJECT ID:</div>
      <div class="ycl-ref-val">${120000 + ((s.id * 37) % 9000)} (${escapeHtml(companyName.toUpperCase())})</div>
      <hr>
      <div class="ycl-field"><span class="k">Alıcı:</span><span class="v">${escapeHtml(s.customerName)}</span></div>
      <div class="ycl-field"><span class="k">Order ID:</span><span class="v">${s.orderNo}</span></div>
      <div class="ycl-field"><span class="k">External Order ID:</span><span class="v">VS${260000 + ((s.id * 13) % 90000)}</span></div>
      <div class="ycl-field"><span class="k">Ürün Sayısı:</span><span class="v">${qty}</span></div>
      <div class="ycl-field"><span class="k">Kanal:</span><span class="v">${escapeHtml(s.channel)}</span></div>
      <div class="ycl-field"><span class="k">Paket No:</span><span class="v">${escapeHtml(s.packageNo)}</span></div>
      <div class="ycl-field"><span class="v">Adrese Teslim</span></div>
      <div class="ycl-qr"></div>
    </div>`
}

// ---- DHL eCommerce (also used by MNG Kargo, which shares this label layout) ----
function renderDhlLabel(s: PrintableParcel, companyName: string): string {
  const qty = totalQtyFor(s.id)
  const desi = s.desi ?? desiFor(s.id)
  return `
    <div class="label ycl ycl-dhl">
      <div class="ycl-title">${escapeHtml(companyName)} KARGO ETİKETİ</div>
      <div class="ycl-barcode"></div>
      <div class="ycl-barcode-no">${escapeHtml(s.trackingNo)}</div>
      <div class="ycl-ref-label">REFERENCE ID:</div>
      <div class="ycl-ref-val">${escapeHtml(s.trackingNo)}</div>
      <hr>
      <div class="ycl-field"><span class="k">Alıcı:</span><span class="v">${escapeHtml(s.customerName)}</span></div>
      <div class="ycl-field"><span class="k">Order ID:</span><span class="v">${s.orderNo}</span></div>
      <div class="ycl-field"><span class="k">External Order ID:</span><span class="v">${pad(s.id * 12345, 8)}</span></div>
      <div class="ycl-field"><span class="k">Ürün Sayısı:</span><span class="v">${qty}</span></div>
      <div class="ycl-field"><span class="k">Desi:</span><span class="v">${desi}</span></div>
      <div class="ycl-field"><span class="v">E-Commerce</span></div>
      <div class="ycl-field"><span class="v">${escapeHtml(s.referenceId)}</span></div>
      <div class="ycl-field"><span class="v">Adrese Teslim</span></div>
      <div class="ycl-field"><span class="k">Gönderici Müşteri Kodu:</span></div>
      <div class="ycl-field"><span class="v">${pad(s.id * 777, 9)} - ${escapeHtml(s.shipFrom.toUpperCase())}</span></div>
      <div class="ycl-qr"></div>
    </div>`
}

// ---- Horoz Lojistik ----
function renderHorozLabel(s: PrintableParcel): string {
  const { date, time } = printDate(s.shipTime)
  const desi = s.desi ?? desiFor(s.id)
  const routeNo = 1 + (s.id % 6)
  const branchCode = `M${pad(s.id * 431, 6)}`
  return `
    <div class="label hrz">
      <div class="hrz-side">${escapeHtml(s.shipTo.province.toUpperCase())}</div>
      <div class="hrz-body">
        <div class="hrz-header">
          <div class="hrz-rut">RUT-${routeNo}</div>
          <div class="hrz-logo">HOROZ<br>LOJİSTİK</div>
        </div>
        <div class="hrz-unvan-label">SATICI UNVAN</div>
        <div class="hrz-alici">ALICI: ${escapeHtml(s.customerName.toUpperCase())}</div>
        <div class="hrz-meta">KARGO&nbsp;&nbsp;&nbsp;${date} ${time}&nbsp;&nbsp;&nbsp;${escapeHtml(s.shipFrom.toUpperCase())}</div>
        <div class="hrz-addr">${escapeHtml(s.shipTo.district)} / ${escapeHtml(s.shipTo.province).toUpperCase()}</div>
        <div class="hrz-dest">${escapeHtml(s.shipTo.district).toUpperCase()} – ${escapeHtml(s.shipTo.province).toUpperCase()}</div>
        <div class="hrz-code">${branchCode}</div>
        <div class="hrz-row">
          <div>
            <div>İRS.NO: ${escapeHtml(s.referenceId)}</div>
            <div>İRS.TARİHİ: ${date}</div>
          </div>
          <div class="hrz-row-right">
            <div>DESİ: <b>${desi}</b></div>
            <div>PARÇA: <b>1/1</b></div>
          </div>
        </div>
        <div class="hrz-barcode"></div>
        <div class="hrz-barcode-no">${escapeHtml(s.trackingNo)}</div>
      </div>
    </div>`
}

// ---- Hepsijet ----
function renderHepsijetLabel(s: PrintableParcel): string {
  const { date, time } = printDate(s.shipTime)
  const desi = s.desi ?? desiFor(s.id)
  const plate = plateCodeFor(s.shipTo.province)
  return `
    <div class="label hpj">
      <div class="hpj-side">
        <div>${escapeHtml(s.shipTo.province.toUpperCase())}</div>
        <div class="hpj-side-sub">${escapeHtml(s.shipTo.district)} (Dış)</div>
      </div>
      <div class="hpj-body">
        <div class="hpj-top">
          <span>{{shortcode}}${s.docNo}</span>
          <span class="hpj-logo">hepsi<b>JET</b></span>
        </div>
        <div class="hpj-dest">${escapeHtml(s.shipTo.district.toLowerCase())}</div>
        <div class="hpj-block"><b>ALICI:</b> ${escapeHtml(s.customerName)}<br>${escapeHtml(s.shipTo.district)} / ${escapeHtml(s.shipTo.province)}</div>
        <div class="hpj-block"><b>GÖNDERİCİ:</b> ${escapeHtml(s.shipFrom)}</div>
        <div class="hpj-meta">Standart Teslimat &nbsp;ÇIKIŞ: ${escapeHtml(s.shipFrom.toUpperCase())}&nbsp;&nbsp;ÇALIŞMA ALANI: ${escapeHtml(s.shipTo.province.toUpperCase())}</div>
        <div class="hpj-meta">1/1 &nbsp;&nbsp;${date} ${time}</div>
        <div class="hpj-code">${escapeHtml(s.trackingNo)}</div>
        <div class="hpj-desi">Desi: ${desi} &nbsp;&nbsp; ${escapeHtml(s.shipTo.province)} ${plate}</div>
        <div class="hpj-codes">
          <div class="hpj-qr"></div>
          <div class="hpj-barcode"></div>
        </div>
      </div>
    </div>`
}

// ---- Generic fallback (used for any carrier without a bespoke layout above) ----
function renderGenericLabel(it: BarcodeLabelItem): string {
  return `
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
    </div>`
}

function renderLabel(parcel: PrintableParcel): string {
  const company = getCompany(parcel.companyId)
  const name = company?.name ?? ''
  if (name === 'Yurtiçi Kargo') return renderYurticiLabel(parcel, name)
  if (name === 'DHL eCommerce' || name === 'MNG Kargo') return renderDhlLabel(parcel, name)
  if (name === 'Horoz Lojistik') return renderHorozLabel(parcel)
  if (name === 'Hepsijet') return renderHepsijetLabel(parcel)
  return renderGenericLabel(parcelBarcodeLabel(parcel))
}

export interface PrintOptions {
  printerType?: string
  resolution?: string
}

function buildLabelHtml(parcels: PrintableParcel[], options: PrintOptions = {}): string {
  const labels = parcels.map(renderLabel).join('')
  const printerLabel = options.printerType ? BARCODE_FORMATS.find((f) => f.key === options.printerType)?.label ?? options.printerType : null
  const printerInfo =
    printerLabel || options.resolution
      ? `<div class="printer-info">${escapeHtml(printerLabel ?? '')}${printerLabel && options.resolution ? ' · ' : ''}${
          options.resolution ? escapeHtml(`${options.resolution} dpi`) : ''
        }</div>`
      : ''

  return `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><title>Kargo Etiketi</title>
<style>
  body{font-family:Arial,Helvetica,sans-serif;background:#f2f2f3;margin:0;padding:24px;}
  .toolbar{max-width:420px;margin:0 auto 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;}
  .printer-info{font-size:12px;color:#666;}
  .toolbar button{padding:9px 16px;border-radius:10px;border:none;background:#1fc16b;color:#fff;font-weight:600;font-size:13px;cursor:pointer;}
  .label{max-width:420px;margin:0 auto 24px;background:#fff;border:2px solid #111;border-radius:10px;padding:22px;}

  /* generic fallback */
  .row{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;font-size:13px;color:#333;}
  .tag{background:#ebf1ff;color:#2547d0;font-size:10px;font-weight:700;letter-spacing:.04em;padding:2px 8px;border-radius:999px;}
  .company{font-size:19px;font-weight:800;margin-bottom:6px;}
  .barcode{height:70px;margin:16px 0 8px;background:${FAKE_BARCODE_BG};}
  .track{text-align:center;font-family:Menlo,monospace;font-size:13px;letter-spacing:2px;margin-bottom:8px;color:#111;}
  .section-title{font-size:10px;text-transform:uppercase;color:#888;letter-spacing:.06em;margin-bottom:2px;margin-top:10px;}
  .addr{font-size:14px;font-weight:700;color:#111;}
  .addr2{font-size:13px;color:#444;}
  hr{border:none;border-top:1px dashed #bbb;margin:12px 0 0;}

  /* Yurtiçi / DHL (+ MNG) shared "kargo etiketi" style — dimensions taken 1:1 from the
     source label PDFs' content box (converted pt -> px at 96dpi), not resized. */
  .ycl{box-sizing:border-box;border:1px solid #999;border-radius:0;padding:18px;}
  .ycl-yurtici{width:372px;height:478px;}
  .ycl-dhl{width:372px;height:483px;}
  .ycl-title{font-size:13px;font-weight:600;color:#333;margin-bottom:10px;}
  .ycl-barcode{height:56px;background:${FAKE_BARCODE_BG};margin-bottom:2px;}
  .ycl-barcode-no{text-align:center;font-size:10px;font-family:Menlo,monospace;letter-spacing:1px;margin-bottom:10px;}
  .ycl-ref-label{font-size:12px;color:#111;margin-top:2px;}
  .ycl-ref-val{font-size:12px;color:#111;margin-bottom:2px;}
  .ycl hr{margin:10px 0;border-top:1px solid #111;}
  .ycl-field{display:flex;gap:6px;font-size:12px;color:#111;margin-bottom:1px;}
  .ycl-field .k{color:#111;}
  .ycl-field .v{color:#111;}
  .ycl-qr{width:70px;height:70px;margin-top:14px;background:${FAKE_QR_BG};}

  /* Horoz Lojistik — 288x432pt source page = exactly 4"x6" (384x576px @96dpi), 1:1. */
  .hrz{box-sizing:border-box;width:384px;height:576px;display:flex;padding:0;overflow:hidden;}
  .hrz-side{writing-mode:vertical-rl;transform:rotate(180deg);font-size:26px;font-weight:800;letter-spacing:2px;padding:14px 6px;border-right:2px solid #111;display:flex;align-items:center;justify-content:center;}
  .hrz-body{padding:16px;flex:1;}
  .hrz-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;}
  .hrz-rut{font-size:12px;font-weight:700;border:1px solid #111;padding:2px 6px;}
  .hrz-logo{font-size:15px;font-weight:800;line-height:1.1;text-align:right;color:#e07a1f;}
  .hrz-unvan-label{font-size:11px;color:#333;}
  .hrz-alici{font-size:17px;font-weight:800;margin:2px 0 8px;}
  .hrz-meta{font-size:11px;color:#333;margin-bottom:2px;}
  .hrz-addr{font-size:11px;color:#333;margin-bottom:6px;}
  .hrz-dest{font-size:24px;font-weight:800;margin-bottom:6px;}
  .hrz-code{font-size:30px;font-weight:800;border-top:1px solid #111;padding-top:4px;margin-bottom:4px;}
  .hrz-row{display:flex;justify-content:space-between;font-size:11px;margin-bottom:8px;}
  .hrz-row-right{text-align:right;}
  .hrz-barcode{height:50px;background:${FAKE_BARCODE_BG};}
  .hrz-barcode-no{text-align:center;font-size:10px;font-family:Menlo,monospace;margin-top:2px;}

  /* Hepsijet — 288.5x432pt source page, also a 4"x6" label (385x576px @96dpi), 1:1. */
  .hpj{box-sizing:border-box;width:385px;height:576px;display:flex;padding:0;overflow:hidden;font-size:11px;}
  .hpj-side{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:800;font-size:16px;padding:14px 6px;border-right:2px solid #111;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;}
  .hpj-side-sub{font-size:11px;font-weight:600;}
  .hpj-body{padding:14px;flex:1;}
  .hpj-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;font-size:10px;color:#555;}
  .hpj-logo{font-size:15px;font-weight:800;color:#7d2ae8;}
  .hpj-logo b{color:#e0197d;}
  .hpj-dest{font-size:20px;font-weight:800;text-transform:uppercase;background:#111;color:#fff;padding:4px 8px;margin-bottom:8px;}
  .hpj-block{margin-bottom:6px;line-height:1.4;}
  .hpj-meta{color:#333;margin-bottom:2px;}
  .hpj-code{font-size:15px;font-weight:800;margin:8px 0 2px;}
  .hpj-desi{color:#333;margin-bottom:8px;}
  .hpj-codes{display:flex;align-items:center;gap:10px;}
  .hpj-qr{width:54px;height:54px;background:${FAKE_QR_BG};flex-shrink:0;}
  .hpj-barcode{height:46px;flex:1;background:${FAKE_BARCODE_BG};}

  @media print {
    body{background:#fff;padding:0;}
    .toolbar{display:none;}
    .label{border:2px solid #000;box-shadow:none;margin-bottom:0;page-break-after:always;}
  }
</style></head>
<body>
  <div class="toolbar">${printerInfo}<button type="button" onclick="window.print()">Yazdır</button></div>
  ${labels}
</body></html>`
}

function openParcelBarcodePrint(parcels: PrintableParcel[], options?: PrintOptions): void {
  if (parcels.length === 0) return
  const html = buildLabelHtml(parcels, options)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank', 'noopener,noreferrer')
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

/** Opens a printable label window for one or more shipments. Each label uses the carrier's
 * own layout when one is known (Yurtiçi Kargo, DHL eCommerce, Horoz Lojistik, Hepsijet);
 * any other carrier falls back to the generic label design. `options` records the chosen
 * printer type/resolution in the print window's toolbar. */
export function openShipmentBarcodePrint(shipments: Shipment[], options?: PrintOptions): void {
  openParcelBarcodePrint(shipments.map(parcelFromShipment), options)
}

/** Same as `openShipmentBarcodePrint`, for return shipments — uses the same carrier templates. */
export function openReturnBarcodePrint(returns: ReturnItem[], options?: PrintOptions): void {
  openParcelBarcodePrint(returns.map(parcelFromReturn), options)
}

/** Same as `openShipmentBarcodePrint`, for transfer shipments — uses the same carrier templates. */
export function openTransferBarcodePrint(transfers: TransferItem[], nodes: StockNode[], options?: PrintOptions): void {
  openParcelBarcodePrint(transfers.map((tr) => parcelFromTransfer(tr, nodes)), options)
}
