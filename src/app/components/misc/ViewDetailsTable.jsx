import React from 'react';

export default function ViewDetailsTable({ dataTable }) {
  return (
    dataTable.map(data => (
      <div key={data.title} className="detail-row">
        <div className="title">{ data.title }</div>
        <div className="data">{ data.value }</div>
      </div>
    ))
  );
}
