import dynamic from "next/dynamic";

const AdminDashboard = dynamic(() => import("@/components/admin/admin-dashboard").then((mod) => mod.AdminDashboard), {
  ssr: false
});

export default function AdminPage() {
  return <div className="editorial"><div className="signal-trace" aria-hidden /><AdminDashboard /></div>;
}
