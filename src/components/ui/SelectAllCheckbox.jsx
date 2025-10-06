export default function SelectAllCheckbox({
  selected,
  allSelected,
  toggleSelectAll,
  isShowCounter = true,
}) {
  return (
    <div>
      {!isShowCounter ? (
        <div>
          <input
            type="checkbox"
            className="checkbox checkbox-secondary checkbox-xs rounded-sm"
            checked={allSelected}
            onChange={toggleSelectAll}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            className="checkbox checkbox-secondary checkbox-xs rounded-sm"
            checked={allSelected}
            onChange={toggleSelectAll}
          />

          <span className="text-sm font-medium text-gray-700">
            {selected.length} selected
          </span>
        </div>
      )}
    </div>
  );
}
