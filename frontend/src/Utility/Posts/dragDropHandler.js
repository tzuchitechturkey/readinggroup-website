// Drag and Drop handler utilities
export const handleDragStart = (e, item, setDraggedItem) => {
  setDraggedItem(item);
  e.dataTransfer.effectAllowed = "move";
};

export const handleDragOver = (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
};

export const handleDrop = (
  e,
  draggedItem,
  targetItem,
  categories,
  setCategories,
  setHasChanges,
  setDraggedItem
) => {
  e.preventDefault();

  if (!draggedItem || draggedItem.id === targetItem.id) {
    setDraggedItem(null);
    return;
  }

  // Create new array with new order
  const newCategories = [...categories];
  const draggedIndex = newCategories.findIndex(
    (cat) => cat.id === draggedItem.id
  );
  const targetIndex = newCategories.findIndex(
    (cat) => cat.id === targetItem.id
  );

  // Swap items
  [newCategories[draggedIndex], newCategories[targetIndex]] = [
    newCategories[targetIndex],
    newCategories[draggedIndex],
  ];

  setCategories(newCategories);
  setHasChanges(true);
};

export const handleDragEnd = (setDraggedItem) => {
  setDraggedItem(null);
};
