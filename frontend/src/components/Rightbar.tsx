const people = [
  { name: "Emma Wilson", initials: "E" },
  { name: "David Park", initials: "D" },
  { name: "Lisa Zhang", initials: "L" },
];

export default function Rightbar() {
  return (
    <aside className="w-72 min-h-screen bg-white border-l flex flex-col p-6 space-y-8">
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="font-bold mb-2">People you may know</div>
        <ul className="space-y-3">
          {people.map((p) => (
            <li key={p.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center font-bold text-purple-700">{p.initials}</div>
                <span className="font-medium text-gray-800">{p.name}</span>
              </div>
              <button className="text-purple-600 font-semibold hover:underline">Follow</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="font-bold mb-2">Your Activity</div>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between"><span>Posts this week</span> <span className="font-bold">12</span></div>
          <div className="flex justify-between"><span>New followers</span> <span className="text-purple-600 font-bold">+23</span></div>
          <div className="flex justify-between"><span>Total likes</span> <span className="text-pink-600 font-bold">1,247</span></div>
        </div>
      </div>
    </aside>
  );
} 