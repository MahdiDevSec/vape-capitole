import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <FaExclamationTriangle className="text-red-500 text-6xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {error.status} خطأ
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {error.statusText}
          </p>
          <button 
            onClick={() => window.history.back()}
            className="btn btn-primary"
          >
            العودة للصفحة السابقة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <FaExclamationTriangle className="text-red-500 text-6xl" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          حدث خطأ غير متوقع
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى لاحقاً.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          تحديث الصفحة
        </button>
      </div>
    </div>
  );
};

export default ErrorBoundary;
