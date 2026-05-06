import { User, Mail, Calendar, MapPin, Package } from "lucide-react";

export default function UserDashboard() {
  const recentOrders = [
    { id: "ORD-001", product: "Website Profil Sekolah", date: "Today", status: "In Progress" },
    { id: "ORD-005", product: "Aplikasi Absensi", date: "May 1, 2026", status: "Completed" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-slate-200">
        <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg leading-6 font-medium text-slate-900">User Profile</h3>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">Personal details and account information.</p>
          </div>
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <User size={32} />
          </div>
        </div>
        <div className="border-t border-slate-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-slate-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <User size={16} /> Full name
              </dt>
              <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2">Budi Santoso</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <Mail size={16} /> Email address
              </dt>
              <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2">student@smktelkom-mlg.sch.id</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <Calendar size={16} /> Member since
              </dt>
              <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2">January 15, 2026</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <MapPin size={16} /> Address
              </dt>
              <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2">
                Jl. Danau Ranau, Sawojajar, Kota Malang
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* My Recent Orders */}
      <div className="bg-white shadow sm:rounded-lg border border-slate-200">
        <div className="px-4 py-5 sm:px-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-slate-900 flex items-center gap-2">
            <Package size={20} className="text-red-600" /> My Recent Orders
          </h3>
          <a href="/user/orders" className="text-sm font-medium text-red-600 hover:text-red-700">
            View all
          </a>
        </div>
        <div className="bg-white">
          <ul role="list" className="divide-y divide-slate-200">
            {recentOrders.map((order) => (
              <li key={order.id}>
                <a href="#" className="block hover:bg-slate-50 transition-colors">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-red-600 truncate">{order.product}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {order.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-slate-500">
                          Order ID: {order.id}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-slate-500 sm:mt-0">
                        <p>
                          Ordered on {order.date}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
