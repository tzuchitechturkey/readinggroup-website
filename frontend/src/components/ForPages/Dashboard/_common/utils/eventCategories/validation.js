export const validateForm = (formData, t) => {
  const newErrors = {};

  if (!formData.name || !formData.name.trim()) {
    newErrors.name = t("Name is required");
  }

  return newErrors;
};

export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};

export const handleDragLogic = {
  handleDragStart: (e, item, setDraggedItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  },

  handleDragOver: (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  },

  handleDrop: (e, targetItem, draggedItem, categories, setCategories, setDraggedItem, setHasChanges) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.id === targetItem.id) {
      setDraggedItem(null);
      return;
    }

    const newCategories = [...categories];
    const draggedIndex = newCategories.findIndex(
      (cat) => cat.id === draggedItem.id
    );
    const targetIndex = newCategories.findIndex(
      (cat) => cat.id === targetItem.id
    );

    [newCategories[draggedIndex], newCategories[targetIndex]] = [
      newCategories[targetIndex],
      newCategories[draggedIndex],
    ];

    setCategories(newCategories);
    setHasChanges(true);
  },

  handleDragEnd: (setDraggedItem) => {
    setDraggedItem(null);
  },
};
