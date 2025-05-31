const FilterResults = ({ results }: { results: any[] }) => {
  if (!results || results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <div className="text-6xl mb-4"></div>
        <h3 className="text-lg font-medium mb-2">No results found</h3>
        <p className="text-sm">Try adjusting your filters or search criteria</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-brand-teal-100 text-brand-teal-800';
      case 'waiting':
        return 'bg-brand-orange-100 text-brand-orange-800';
      case 'cancelled':
        return 'bg-brand-coral-100 text-brand-coral-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        {results.length} result{results.length !== 1 ? 's' : ''} found
      </div>

      {results.map((item, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {item.title || 'Untitled Reservation'}
            </h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                item.status,
              )}`}
            >
              {item.status || 'Unknown'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <span className="font-medium mr-2">Time:</span>
                <span>{formatDate(item.time)}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <span className="font-medium mr-2">Guests:</span>
                <span>{item.numGuests || 'Not specified'}</span>
              </div>
            </div>

            <div className="space-y-2">
              {item.cuisine && item.cuisine.length > 0 && (
                <div className="flex items-start text-gray-600">
                  <span className="font-medium mr-2">Cuisine:</span>
                  <div className="flex flex-wrap gap-1">
                    {item.cuisine.map((c: string, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-brand-coral-50 text-brand-coral-700"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.dietary && item.dietary.length > 0 && (
                <div className="flex items-start text-gray-600">
                  <span className="font-medium mr-2">Dietary:</span>
                  <div className="flex flex-wrap gap-1">
                    {item.dietary.map((d: string, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-brand-teal-50 text-brand-teal-700"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {item.additionalInfo && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Additional Info:</span>{' '}
                {item.additionalInfo}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FilterResults;
