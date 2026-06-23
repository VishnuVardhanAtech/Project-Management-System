import React from 'react'

export default function Topbar({ breadcrumb, children }) {
  return (
    <header className="topbar">
      <div className="breadcrumb">
        {breadcrumb.map((item, i) => (
          <React.Fragment key={i}>
            <span>{item}</span>
            {i < breadcrumb.length - 1 && <span className="breadcrumb-sep">/</span>}
          </React.Fragment>
        ))}
      </div>
      <div className="topbar-spacer" />
      {children}
    </header>
  )
}
