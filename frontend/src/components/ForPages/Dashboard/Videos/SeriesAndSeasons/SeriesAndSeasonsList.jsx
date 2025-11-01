import React, { useState, useEffect } from "react";

import { Edit, Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react";
import { LuArrowUpDown } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Modal from "@/components/Global/Modal/Modal";
import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import {
  GetSeries,
  DeleteSeriesById,
  GetSeasonsBySeriesId,
  DeleteSeasonById,
} from "@/api/videos";
import { Button } from "@/components/ui/button";

import DeleteSeriesConfirmation from "../VideosSeries/DeleteSeriesConfirmation";
import CreateOrEditSeries from "../VideosSeries/CreateOrEditSeries";
import DeleteSeasonConfirmation from "../VideosSeasons/DeleteSeasonConfirmation";
import CreateOrEditSeason from "../VideosSeasons/CreateOrEditSeason";

function SeriesAndSeasonsList({ onSectionChange }) {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Series States
  const [seriesData, setSeriesData] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [showSeriesModal, setShowSeriesModal] = useState(false);
  const [editingSeries, setEditingSeries] = useState(null);
  const [showDeleteSeriesModal, setShowDeleteSeriesModal] = useState(false);

  // Seasons States
  const [expandedSeries, setExpandedSeries] = useState({});
  const [seasonsData, setSeasonsData] = useState({});
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const [editingSeason, setEditingSeason] = useState(null);
  const [showDeleteSeasonModal, setShowDeleteSeasonModal] = useState(false);
  const [currentSeriesForSeason, setCurrentSeriesForSeason] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [update, setUpdate] = useState(false);

  // Fetch Series Data
  const getSeriesData = async (searchValue = "") => {
    setIsLoading(true);
    try {
      const res = await GetSeries(searchValue);
      setSeriesData(res?.data?.results || []);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSeriesData();
  }, [update]);

  // Fetch Seasons for a specific Series
  const fetchSeasonsBySeries = async (seriesId) => {
    if (seasonsData[seriesId]) return; // Already loaded

    setIsLoading(true);
    try {
      const res = await GetSeasonsBySeriesId(seriesId);
      setSeasonsData((prev) => ({
        ...prev,
        [seriesId]: res?.data?.results || [],
      }));
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Series Expansion
  const toggleSeriesExpansion = async (seriesId) => {
    const isCurrentlyExpanded = expandedSeries[seriesId];

    if (!isCurrentlyExpanded) {
      await fetchSeasonsBySeries(seriesId);
    }

    setExpandedSeries((prev) => ({
      ...prev,
      [seriesId]: !isCurrentlyExpanded,
    }));
  };

  // Sort Data
  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Handle Search
  const handleSearch = () => {
    if (searchTerm.trim()) {
      getSeriesData(searchTerm);
    } else {
      getSeriesData("");
    }
  };

  // Clear Search
  const handleClearSearch = () => {
    setSearchTerm("");
    getSeriesData("");
  };

  // Sort Series
  const getSortedSeries = () => {
    if (!sortConfig.key) return seriesData;

    return [...seriesData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const strA = String(aValue).toLowerCase();
      const strB = String(bValue).toLowerCase();

      if (strA < strB) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (strA > strB) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  // Sort Icon
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <LuArrowUpDown className="h-3 w-3 text-gray-400" />;
    }
    return sortConfig.direction === "asc" ? (
      <LuArrowUpDown className="h-3 w-3 text-blue-600 rotate-180" />
    ) : (
      <LuArrowUpDown className="h-3 w-3 text-blue-600" />
    );
  };

  // Series Actions
  const handleAddSeries = () => {
    setEditingSeries(null);
    setShowSeriesModal(true);
  };

  const handleEditSeries = (series, e) => {
    e.stopPropagation();
    setEditingSeries(series);
    setShowSeriesModal(true);
  };

  const handleDeleteSeries = (series, e) => {
    e.stopPropagation();
    setSelectedSeries(series);
    setShowDeleteSeriesModal(true);
  };

  const handleConfirmDeleteSeries = async () => {
    if (!selectedSeries?.id) return;

    setIsLoading(true);
    try {
      await DeleteSeriesById(selectedSeries.id);
      setShowDeleteSeriesModal(false);
      setSelectedSeries(null);
      toast.success(t("Series deleted successfully"));
      setUpdate((prev) => !prev);

      // Clear seasons data for this series
      const newSeasonsData = { ...seasonsData };
      delete newSeasonsData[selectedSeries.id];
      setSeasonsData(newSeasonsData);

      // Collapse if expanded
      if (expandedSeries[selectedSeries.id]) {
        const newExpanded = { ...expandedSeries };
        delete newExpanded[selectedSeries.id];
        setExpandedSeries(newExpanded);
      }
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Season Actions
  const handleAddSeason = (series, e) => {
    e.stopPropagation();
    setCurrentSeriesForSeason(series);
    setEditingSeason(null);
    setShowSeasonModal(true);
  };

  const handleEditSeason = (season, e) => {
    e.stopPropagation();
    setEditingSeason(season);
    setShowSeasonModal(true);
  };

  const handleDeleteSeason = (season, seriesId, e) => {
    e.stopPropagation();
    setSelectedSeason({ ...season, seriesId });
    setShowDeleteSeasonModal(true);
  };

  const handleConfirmDeleteSeason = async () => {
    if (!selectedSeason?.id) return;

    setIsLoading(true);
    try {
      await DeleteSeasonById(selectedSeason.id);
      setShowDeleteSeasonModal(false);
      toast.success(t("Season deleted successfully"));

      // Refresh seasons for this series
      const seriesId = selectedSeason.seriesId;
      const newSeasonsData = { ...seasonsData };
      delete newSeasonsData[seriesId];
      setSeasonsData(newSeasonsData);
      await fetchSeasonsBySeries(seriesId);

      setSelectedSeason(null);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSeriesModal = () => {
    setShowSeriesModal(false);
    setEditingSeries(null);
  };

  const handleCloseSeasonModal = () => {
    setShowSeasonModal(false);
    setEditingSeason(null);
    setCurrentSeriesForSeason(null);
  };

  const handleSeriesSuccess = () => {
    setUpdate((prev) => !prev);
    handleCloseSeriesModal();
  };

  const handleSeasonSuccess = () => {
    // Refresh seasons for the current series
    if (currentSeriesForSeason?.id) {
      const newSeasonsData = { ...seasonsData };
      delete newSeasonsData[currentSeriesForSeason.id];
      setSeasonsData(newSeasonsData);
      fetchSeasonsBySeries(currentSeriesForSeason.id);
    } else if (editingSeason?.season_title?.id) {
      const newSeasonsData = { ...seasonsData };
      delete newSeasonsData[editingSeason.season_title.id];
      setSeasonsData(newSeasonsData);
      fetchSeasonsBySeries(editingSeason.season_title.id);
    }
    handleCloseSeasonModal();
  };

  return (
    <div className="w-full space-y-4">
      {isLoading && <Loader />}
      {/* Start Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSectionChange("dashboard")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            ← {t("Back to Dashboard")}
          </button>
          <div className="h-4 w-px bg-gray-300" />
          <h2 className="text-xl font-semibold text-[#1D2630]">
            {t("Season & Series Management")}
          </h2>
        </div>
      </div>
      {/* End Breadcrumb */}
      {/* Header Section */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b bg-white rounded-lg mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("Videos Series & Seasons")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t("Manage your video series and their seasons")}
          </p>
        </div>
        <Button
          onClick={handleAddSeries}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("Add New Series")}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
        <div className="relative max-w-md flex">
          <input
            type="text"
            placeholder={t("Search by series name...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className={`flex-1 px-4 py-2 border border-gray-300 ${
              i18n?.language === "ar" ? "rounded-r-lg" : "rounded-l-lg"
            } text-sm pr-8`}
          />

          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className={` absolute ${
                i18n?.language === "ar" ? " left-20" : " right-20"
              } top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700`}
            >
              ✕
            </button>
          )}

          <button
            onClick={handleSearch}
            className={`px-4 py-2 bg-[#4680ff] text-white ${
              i18n?.language === "ar" ? "rounded-l-lg" : "rounded-r-lg"
            }  text-sm font-semibold hover:bg-blue-600`}
          >
            {t("Search")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12" />
                <TableHead className="w-16 text-center">#</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => sortData("name")}
                >
                  <div className="flex items-center gap-2">
                    {t("Series Name")}
                    {getSortIcon("name")}
                  </div>
                </TableHead>
                <TableHead className="text-center w-48">
                  {t("Actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getSortedSeries().length > 0 ? (
                getSortedSeries().map((series, index) => (
                  <React.Fragment key={series.id}>
                    {/* Series Row */}
                    <TableRow
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleSeriesExpansion(series.id)}
                    >
                      <TableCell className="text-center">
                        {expandedSeries[series.id] ? (
                          <ChevronDown className="h-4 w-4 text-gray-600" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-600" />
                        )}
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {series.name || t("Untitled Series")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => handleAddSeason(series, e)}
                            className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                            title={t("Add Season")}
                          >
                            <Plus className="h-4 w-4 text-green-600" />
                          </button>
                          <button
                            onClick={(e) => handleEditSeries(series, e)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title={t("Edit Series")}
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteSeries(series, e)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title={t("Delete Series")}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Seasons Rows (Expanded) */}
                    {expandedSeries[series.id] &&
                    seasonsData[series.id]?.length > 0
                      ? seasonsData[series.id].map((season, seasonIndex) => (
                          <TableRow
                            key={`season-${season.id}`}
                            className="bg-gray-50"
                          >
                            <TableCell />
                            <TableCell className="text-center text-sm text-gray-600">
                              .{seasonIndex + 1}
                            </TableCell>
                            <TableCell className="pl-12 text-sm text-gray-700">
                              {season.season_id}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={(e) => handleEditSeason(season, e)}
                                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                  title={t("Edit Season")}
                                >
                                  <Edit className="h-3 w-3 text-blue-600" />
                                </button>
                                <button
                                  onClick={(e) =>
                                    handleDeleteSeason(season, series.id, e)
                                  }
                                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                  title={t("Delete Season")}
                                >
                                  <Trash2 className="h-3 w-3 text-red-600" />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      : expandedSeries[series.id] && (
                          <TableRow className="bg-gray-50">
                            <TableCell />
                            <TableCell />
                            <TableCell
                              colSpan={2}
                              className="text-center py-4 text-sm text-gray-500"
                            >
                              {t("No seasons found for this series")}
                            </TableCell>
                          </TableRow>
                        )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">
                        {t("No series found")}
                      </p>
                      <p className="text-sm mt-1">
                        {searchTerm
                          ? t("Try adjusting your search")
                          : t("Start by adding a new series")}
                      </p>
                      {searchTerm && (
                        <button
                          onClick={handleClearSearch}
                          className="mt-3 text-blue-500 hover:text-blue-600 underline text-sm"
                        >
                          {t("Clear Search")}
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Series Modal */}
      <Modal
        isOpen={showSeriesModal}
        onClose={handleCloseSeriesModal}
        title={editingSeries ? t("Edit Series") : t("Add New Series")}
      >
        <CreateOrEditSeries
          series={editingSeries}
          onClose={handleCloseSeriesModal}
          onSuccess={handleSeriesSuccess}
        />
      </Modal>

      {/* Season Modal */}
      <Modal
        isOpen={showSeasonModal}
        onClose={handleCloseSeasonModal}
        title={editingSeason ? t("Edit Season") : t("Add New Season")}
      >
        <CreateOrEditSeason
          season={editingSeason}
          onClose={handleCloseSeasonModal}
          onSuccess={handleSeasonSuccess}
          preSelectedSeries={currentSeriesForSeason}
        />
      </Modal>

      {/* Delete Series Confirmation */}
      <Modal
        isOpen={showDeleteSeriesModal}
        onClose={() => setShowDeleteSeriesModal(false)}
        title={t("Delete Series")}
      >
        <DeleteSeriesConfirmation
          onCancel={() => setShowDeleteSeriesModal(false)}
          onConfirm={handleConfirmDeleteSeries}
          itemName={selectedSeries?.name}
        />
      </Modal>

      {/* Delete Season Confirmation */}
      <Modal
        isOpen={showDeleteSeasonModal}
        onClose={() => setShowDeleteSeasonModal(false)}
        title={t("Delete Season")}
      >
        <DeleteSeasonConfirmation
          onCancel={() => setShowDeleteSeasonModal(false)}
          onConfirm={handleConfirmDeleteSeason}
          itemName={`${t("Season")} ${selectedSeason?.season_number}`}
        />
      </Modal>
    </div>
  );
}

export default SeriesAndSeasonsList;
