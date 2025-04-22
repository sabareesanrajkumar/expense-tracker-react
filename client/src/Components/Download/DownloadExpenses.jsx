import { useSelector } from 'react-redux';

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

  return <button onClick={downloadCSV}>Download Expenses as CSV</button>;
};

export default DownloadExpenses;
