import { useToastStore } from '../../lib/toast'

const kindClass: Record<string, string> = {
  success: 'bg-[#e3f7ec] text-[#178c4e] border-[#84ebb4]',
  info: 'bg-[#ebf1ff] text-[#2547d0] border-[#c0d5ff]',
  error: 'bg-[#ffebec] text-[#ad1f2b] border-[#ffc0c5]',
}

export function Toasts() {
  const items = useToastStore((s) => s.items)

  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2" style={{ width: 300 }}>
      {items.map((item) => (
        <div
          key={item.id}
          className={`toast border rounded-lg px-3.5 py-2.5 text-[13px] font-medium shadow-sm ${kindClass[item.kind] ?? kindClass.success}`}
        >
          {item.message}
        </div>
      ))}
    </div>
  )
}
