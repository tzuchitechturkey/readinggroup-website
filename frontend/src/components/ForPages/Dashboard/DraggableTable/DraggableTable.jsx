import React, { useState } from "react";

import { toast } from "react-toastify";

import TableButtons from "@/components/Global/TableButtons/TableButtons";

function DraggableTable({
  t,
  i18n,
  data,
  setData,
  columns,
  actions,
  originalData,
  setOriginalData,
  hasChanges,
  setHasChanges,
  onSaveOrder,
  totalRecords,
  currentPage,
  onPageChange,
  limit = 10,
  isDraggable = true,
  isLoading = false,
}) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [isSorting, setIsSorting] = useState(false);
  const totalPages = Math.ceil(totalRecords / limit);

  const handleCancelOrder = () => {
    setData(JSON.parse(JSON.stringify(originalData)));
    setHasChanges(false);
    toast.info(t("Changes cancelled"));
  };

  const handleDragStart = (e, item) => {
    if (!isDraggable) return;
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    if (!isDraggable) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetItem) => {
    if (!isDraggable) return;
    e.preventDefault();

    if (!draggedItem || draggedItem.id === targetItem.id) {
      setDraggedItem(null);
      return;
    }

    const newData = [...data];
    const draggedIndex = newData.findIndex((item) => item.id === draggedItem.id);
    const targetIndex = newData.findIndex((item) => item.id === targetItem.id);

    [newData[draggedIndex], newData[targetIndex]] = [
      newData[targetIndex],
      newData[draggedIndex],
    ];

    setData(newData);
    setHasChanges(true);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleSaveOrder = async () => {
    if (!onSaveOrder) return;
    
    setIsSorting(true);
    try {
      const sortData = data.map((item, index) => ({
        id: item.id,
        order: index,
      }));
      
      await onSaveOrder(sortData);
      toast.success(t("Items reordered successfully"));
      setHasChanges(false);
      setOriginalData(JSON.parse(JSON.stringify(data)));
    } catch (err) {
      console.error(err);
      toast.error(t("Failed to reorder items"));
    } finally {
      setIsSorting(false);
    }
  };

  const renderCellContent = (item, column) => {
    if (column.render) {
      return column.render(item);
    }
    
    const value = column.key.split('.').reduce((obj, key) => obj?.[key], item);
    return value || "-";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr
              className={`${
                i18n?.language === "ar" ? "text-right " : "text-left"
              }text-sm text-gray-600`}
            >
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`${
                    i18n?.language === "ar" ? "text-right " : "text-left"
                  } py-2 px-3 ${column.width || ""}`}
                >
                  {t(column.title)}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th
                  className={`${
                    i18n?.language === "ar" ? "text-right " : "text-left"
                  } py-2 px-3 w-[160px]`}
                >
                  {t("Actions")}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <tr
                key={item.id}
                draggable={isDraggable}
                onDragStart={(e) => handleDragStart(e, item)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, item)}
                onDragEnd={handleDragEnd}
                className={`border-t transition-all duration-200 ${
                  draggedItem?.id === item.id
                    ? "opacity-50 bg-blue-50"
                    : isDraggable
                      ? "cursor-move hover:bg-gray-50"
                      : "hover:bg-gray-50"
                } ${isSorting ? "opacity-75" : ""}`}
                style={{
                  cursor: isSorting
                    ? "not-allowed"
                    : isDraggable
                      ? "move"
                      : "default",
                }}
              >
                {columns.map((column, index) => (
                  <td key={index} className="py-3 px-3">
                    {renderCellContent(item, column)}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="py-3 px-3">
                    <div className="flex gap-2">
                      {actions
                        .filter(
                          (action) =>
                            !(
                              action.title === "Delete" &&
                              localStorage.getItem("userType") === "editor"
                            ),
                        )
                        .map((action, index) => (
                          <button
                            key={index}
                            onClick={() => action.onClick(item)}
                            className={action.className || "p-1 rounded hover:bg-gray-100"}
                            title={t(action.title)}
                            disabled={action.disabled ? action.disabled(item) : false}
                          >
                            {action.icon}
                          </button>
                        ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* {totalPages > 1 && ( */}
          <TableButtons
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
            t={t}
          />
        {/* )} */}
      </div>

      {/* Save/Cancel Order Buttons */}
      {hasChanges && isDraggable && (
        <div className="flex gap-3 p-4 bg-yellow-50 border-t border-yellow-200">
          <div className="flex-1 flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <span className="text-sm text-yellow-700">
              {t("You have unsaved changes in the order")}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCancelOrder}
              disabled={isSorting}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {t("Cancel")}
            </button>
            <button
              onClick={handleSaveOrder}
              disabled={isSorting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isSorting ? (
                <>
                  <span className="inline-block animate-spin">⟳</span>
                  {t("Saving...")}
                </>
              ) : (
                `✓ ${t("Save Changes")}`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DraggableTable;