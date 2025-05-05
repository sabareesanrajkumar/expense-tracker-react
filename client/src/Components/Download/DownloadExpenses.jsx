import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';

const DownloadExpenses = () => {
  const expenses = useSelector((state) => state.expenses?.items);

  const downloadCSV = () => {
    const headers = ['Amount', 'Description', 'Category'];
    const rows = expenses.map((exp) =>
      [exp.amount, exp.description, exp.category].join(',')
    );

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Button
        variant="outline-primary"
        className="position-fixed p-3"
        style={{ right: '20px', top: '80px' }}
        onClick={downloadCSV}
      >
        Download Expenses
      </Button>
    </div>
  );
};

export default DownloadExpenses;
