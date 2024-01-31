import React from "react";
import { NavLink } from "react-router-dom";

export function Navbar() {
  const routes = [
    { label: 'Overview', path: '/' },
    { label: 'Billboards', path: '/billboards' }, // Adjust paths accordingly
    { label: 'Categories', path: '/categories' },
    // Add more routes as needed
  ];

  return (
    <nav className={"flex items-center space-x-4 lg:space-x-6"}>
      {routes.map((route, index) => (
        <NavLink
          key={index}
          to={route.path}
          className={
            'text-sm font-medium transition-colors hover:text-primary text-muted-foreground'
          }
        >
          {route.label}
        </NavLink>
      ))}
    </nav>
  );
}
