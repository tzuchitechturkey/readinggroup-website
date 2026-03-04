import React from "react";

import { Calendar, User, Tag, FileText, Globe, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";

const RelatedReportsDetails = ({ report, onClose, onEdit }) => {
  const { t } = useTranslation();

  if (!report) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">{t("No report data available")}</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return t("Not specified");
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        {report.image && (
          <div className="mb-4">
            <img
              src={report.image}
              alt={report.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {report.title}
            </h2>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{formatDate(report.created_at)}</span>
              </div>
              
              {report.category && (
                <div className="flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {report.category.name}
                  </span>
                </div>
              )}
              
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span className={`text-sm font-medium ${report.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                  {report.is_active ? t("Active") : t("Inactive")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        
        {/* Description Section */}
        {report.description && (
          <div>
            <div className="flex items-center mb-3">
              <FileText className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                {t("Description")}
              </h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {report.description}
              </p>
            </div>
          </div>
        )}

        {/* Content Section */}
        {report.content && (
          <div>
            <div className="flex items-center mb-3">
              <FileText className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                {t("Content")}
              </h3>
            </div>
            <div 
              className="bg-gray-50 p-4 rounded-lg prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: report.content }}
            />
          </div>
        )}

        {/* URL/Link Section */}
        {report.url && (
          <div>
            <div className="flex items-center mb-3">
              <Globe className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                {t("Report Link")}
              </h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <a
                href={report.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline break-all"
              >
                {report.url}
              </a>
            </div>
          </div>
        )}

        {/* Metadata Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("Report Information")}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <dt className="text-sm font-medium text-gray-500 mb-1">
                {t("Created Date")}
              </dt>
              <dd className="text-sm text-gray-900">
                {formatDate(report.created_at)}
              </dd>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <dt className="text-sm font-medium text-gray-500 mb-1">
                {t("Last Updated")}
              </dt>
              <dd className="text-sm text-gray-900">
                {formatDate(report.updated_at)}
              </dd>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <dt className="text-sm font-medium text-gray-500 mb-1">
                {t("Category")}
              </dt>
              <dd className="text-sm text-gray-900">
                {report.category?.name || t("Uncategorized")}
              </dd>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <dt className="text-sm font-medium text-gray-500 mb-1">
                {t("Status")}
              </dt>
              <dd className="text-sm text-gray-900">
                {report.is_active ? t("Active") : t("Inactive")}
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {t("Close")}
        </button>
        
        <button
          onClick={() => {
            onEdit();
            onClose();
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {t("Edit Report")}
        </button>
      </div>
    </div>
  );
};

export default RelatedReportsDetails;