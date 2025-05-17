import React from 'react';

const Sidebar: React.FC = () => {
  // Navigation items
  const navItems = [
    { name: 'Dashboard', active: false },
    { name: 'Chats', active: false },
    { name: 'Feed', active: false },
    { name: 'Places', active: false },
    { name: 'Profile', active: true },
  ];

  return (
    <div className="h-screen w-64 bg-gray-200 border-r border-gray-300 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-300">
        <h1 className="text-2xl font-bold">DwL Logo</h1>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 mt-2">
        {navItems.map((item) => (
          <a
            href="#"
            key={item.name}
            className={`flex items-center py-6 px-6 text-lg font-medium border-b border-gray-300 ${
              item.active
                ? 'bg-white text-primary'
                : 'text-gray-800 hover:bg-gray-300'
            }`}
          >
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
