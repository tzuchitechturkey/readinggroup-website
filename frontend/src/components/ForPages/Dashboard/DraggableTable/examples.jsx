// مثال على كيفية استخدام مكون DraggableTable في أماكن أخرى

import React, { useState } from "react";

import { Edit, Trash2, Eye } from "lucide-react";

import DraggableTable from "@/components/ForPages/Dashboard/DraggableTable/DraggableTable";

// مثال 1: جدول للمستخدمين
function UsersTable({ users, setUsers, onEditUser, onDeleteUser }) {
  const [hasChanges, setHasChanges] = useState(false);
  const [originalUsers, setOriginalUsers] = useState(users);
  const [currentPage, setCurrentPage] = useState(1);

  const columns = [
    {
      title: "Name",
      key: "name",
    },
    {
      title: "Email", 
      key: "email",
    },
    {
      title: "Role",
      key: "role",
    },
    {
      title: "Status",
      key: "is_active",
      render: (item) => (
        <span className={`px-2 py-1 rounded ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {item.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  const actions = [
    {
      title: "Edit",
      icon: <Edit className="h-4 w-4 text-blue-600" />,
      onClick: onEditUser,
    },
    {
      title: "Delete",
      icon: <Trash2 className="h-4 w-4 text-red-600" />,
      onClick: onDeleteUser,
    },
  ];

  const handleSaveOrder = async (sortData) => {
    // استدعاء API لحفظ ترتيب المستخدمين
    // await sortUsersAPI(sortData);
  };

  return (
    <DraggableTable
      t={(key) => key} // يمكن تمرير دالة الترجمة الحقيقية
      i18n={{ language: 'en' }}
      data={users}
      setData={setUsers}
      columns={columns}
      actions={actions}
      originalData={originalUsers}
      setOriginalData={setOriginalUsers}
      hasChanges={hasChanges}
      setHasChanges={setHasChanges}
      onSaveOrder={handleSaveOrder}
      totalRecords={users?.length || 0}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      limit={10}
      isDraggable={true}
    />
  );
}

// مثال 2: جدول للمنتجات (بدون سحب وإفلات)
function ProductsTable({ products, onViewProduct }) {
  const columns = [
    {
      title: "Product Name",
      key: "name",
    },
    {
      title: "Price", 
      key: "price",
      render: (item) => `$${item.price}`,
    },
    {
      title: "Category",
      key: "category.name", // دعم للمتغيرات المتداخلة
    },
  ];

  const actions = [
    {
      title: "View",
      icon: <Eye className="h-4 w-4 text-green-600" />,
      onClick: onViewProduct,
    },
  ];

  return (
    <DraggableTable
      t={(key) => key}
      i18n={{ language: 'en' }}
      data={products}
      setData={() => {}} // لا حاجة للتعديل
      columns={columns}
      actions={actions}
      originalData={products}
      setOriginalData={() => {}}
      hasChanges={false}
      setHasChanges={() => {}}
      totalRecords={products?.length || 0}
      currentPage={1}
      onPageChange={() => {}}
      isDraggable={false} // بدون سحب وإفلات
    />
  );
}

// مثال 3: جدول بسيط بدون أزرار
function SimpleTable({ data, columns }) {
  return (
    <DraggableTable
      t={(key) => key}
      i18n={{ language: 'en' }}
      data={data}
      setData={() => {}}
      columns={columns}
      actions={[]} // بدون أزرار
      originalData={data}
      setOriginalData={() => {}}
      hasChanges={false}
      setHasChanges={() => {}}
      totalRecords={data?.length || 0}
      currentPage={1}
      onPageChange={() => {}}
      isDraggable={false}
    />
  );
}

export { UsersTable, ProductsTable, SimpleTable };