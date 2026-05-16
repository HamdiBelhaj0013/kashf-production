import { requireAdmin } from "@/lib/admin-auth";
import { db, projects, clients, team, messages } from "@/db";
import { eq, count, and, desc } from "drizzle-orm";
import AdminShell from "@/components/admin/AdminShell";
import Link from "next/link";
import { Clapperboard, Building2, Users, MessageSquare, Plus, Mail, Inbox, Star, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  await requireAdmin();

  const [projectCount] = await db.select({ count: count() }).from(projects);
  const [clientCount] = await db
    .select({ count: count() })
    .from(clients)
    .where(eq(clients.active, true));
  const [teamCount] = await db
    .select({ count: count() })
    .from(team)
    .where(eq(team.active, true));
  const [unreadCount] = await db
    .select({ count: count() })
    .from(messages)
    .where(and(eq(messages.read, false), eq(messages.archived, false)));

  const [totalMessageCount] = await db.select({ count: count() }).from(messages);
  const [featuredCount] = await db
    .select({ count: count() })
    .from(projects)
    .where(eq(projects.featured, true));

  // Category breakdown computed in JS to avoid groupBy complexity
  const allProjectCategories = await db.select({ category: projects.category }).from(projects);
  const categoryCounts: Record<string, number> = {};
  for (const p of allProjectCategories) {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  }
  const categoryBreakdown = Object.entries(categoryCounts)
    .map(([category, cnt]) => ({ category, count: cnt }))
    .sort((a, b) => b.count - a.count);
  const topCategoryRaw = categoryBreakdown[0]?.category;
  const topCategory = topCategoryRaw
    ? topCategoryRaw.charAt(0).toUpperCase() + topCategoryRaw.slice(1)
    : "—";
  const maxCategoryCount = categoryBreakdown[0]?.count || 1;

  const recentMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.archived, false))
    .orderBy(desc(messages.createdAt))
    .limit(5);

  const recentProjects = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.createdAt))
    .limit(5);

  const stats = [
    { label: "Projects", value: projectCount.count, Icon: Clapperboard, href: "/kashfoffice/projects" },
    { label: "Active Clients", value: clientCount.count, Icon: Building2, href: "/kashfoffice/clients" },
    { label: "Team Members", value: teamCount.count, Icon: Users, href: "/kashfoffice/team" },
    { label: "Unread Messages", value: unreadCount.count, Icon: MessageSquare, href: "/kashfoffice/messages" },
  ];

  const stats2 = [
    { label: "Total Messages", value: totalMessageCount.count, Icon: Inbox, href: "/kashfoffice/messages" },
    { label: "Featured Projects", value: featuredCount.count, Icon: Star, href: "/kashfoffice/projects" },
    { label: "Top Category", value: topCategory, Icon: TrendingUp, href: "/kashfoffice/projects" },
  ];

  return (
    <AdminShell pageTitle="Dashboard" unreadCount={unreadCount.count}>
      {/* Stats row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {stats.map(({ label, value, Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Icon className="w-5 h-5 text-gray-700" />
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </Link>
        ))}
      </div>

      {/* Stats row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats2.map(({ label, value, Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Icon className="w-5 h-5 text-gray-700" />
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </Link>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Messages */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Recent Messages</h2>
            <Link href="/kashfoffice/messages" className="text-xs text-gray-400 hover:text-gray-700">
              View all →
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400">No messages yet</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentMessages.map((msg) => (
                <Link
                  key={msg.id}
                  href={`/kashfoffice/messages/${msg.id}`}
                  className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${msg.read ? "bg-gray-200" : "bg-gray-900"}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm truncate ${msg.read ? "text-gray-600" : "font-medium text-gray-900"}`}>
                      {msg.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{msg.message.slice(0, 60)}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ""}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Recent Projects</h2>
            <Link href="/kashfoffice/projects" className="text-xs text-gray-400 hover:text-gray-700">
              View all →
            </Link>
          </div>
          {recentProjects.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-400">No projects yet</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/kashfoffice/projects/${p.id}/edit`}
                  className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.title}</p>
                    <p className="text-xs text-gray-400">{p.client} · {p.year}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full capitalize">
                    {p.category}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Projects by Category */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Projects by Category</h2>
        </div>
        <div className="p-6 space-y-3">
          {categoryBreakdown.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No projects yet</p>
          ) : (
            categoryBreakdown.map(({ category, count: cnt }) => (
              <div key={category} className="flex items-center gap-3">
                <div className="w-20 text-sm text-gray-500 capitalize shrink-0">{category}</div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-gray-900 rounded-full"
                    style={{ width: `${(cnt / maxCategoryCount) * 100}%` }}
                  />
                </div>
                <div className="w-6 text-right text-sm font-bold text-gray-700 shrink-0">{cnt}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/kashfoffice/projects/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
        <Link
          href="/kashfoffice/clients/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:border-gray-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Client
        </Link>
        <Link
          href="/kashfoffice/team/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:border-gray-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Member
        </Link>
        <Link
          href="/kashfoffice/messages"
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:border-gray-400 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Messages {unreadCount.count > 0 && `(${unreadCount.count})`}
        </Link>
      </div>
    </AdminShell>
  );
}
