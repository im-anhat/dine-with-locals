const FilterResults = ({ results }: { results: any[] }) => {
  if (!results || results.length === 0) {
    return (
      <p className="text-center text-muted-foreground">No results found.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {results.map((item, idx) => (
        <div
          key={idx}
          className="border rounded-lg p-4 shadow-sm bg-white space-y-2"
        >
          <h2 className="text-xl font-semibold">{item.title}</h2>
          <p className="text-sm text-muted-foreground">
            {new Date(item.time).toLocaleString()}
          </p>
          <p className="text-sm">Guests: {item.numGuests}</p>
          <p className="text-sm">Cuisine: {item.cuisine?.join(', ')}</p>
          <p className="text-sm">Dietary: {item.dietary?.join(', ')}</p>
          <p className="text-sm">Status: {item.status}</p>
          <p className="text-sm italic text-muted-foreground">
            {item.additionalInfo}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FilterResults;
