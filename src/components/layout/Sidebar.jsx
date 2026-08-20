import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  Wallet,
} from "lucide-react"

const menuItems = [
  {
    label: "Saldo atual",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Lançamentos",
    path: "/lancamentos",
    icon: ArrowLeftRight,
  },
  {
    label: "Investimentos",
    path: "/investimentos",
    icon: TrendingUp,
  },
]

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      
      <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
          <Wallet size={22} />
        </div>

        <div>
          <h1 className="font-semibold text-slate-800">
            Meu Financeiro
          </h1>

          <p className="text-xs text-slate-500">
            Controle pessoal
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <Icon size={20} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">
            Educação financeira
          </p>

          <p className="mt-1 text-sm font-medium text-slate-700">
            Organize hoje para entender melhor o amanhã.
          </p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar