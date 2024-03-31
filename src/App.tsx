import { ChangeEvent, EventHandler, useEffect, useState } from "react";
import "./App.css";
import DataTable, { TableColumn } from "react-data-table-component";
import axios from "axios";
import { clearScreenDown } from "readline";
type DataRow = {
  id: number;
  name: string;
  detail: string;
  coverimage: string;
  latitude: string;
  longitude: string;
};
const columns: TableColumn<DataRow>[] = [
  {
    name: "ID",
    selector: (row) => row.id,
    sortable: true,
    width: "100px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
    width : "100px"
  },
  {
    name: "CoverImage",
    selector: (row) => row.coverimage,
    sortable: true,
    cell: (row) => <img src={row.coverimage} width={100} alt={row.name}></img>,
    width: "100px",
  },
  {
    name: "Detail",
    selector: (row) => row.detail,
    sortable: true,
    width : "750px"
  },
  {
    name: "Latitude",
    selector: (row) => row.latitude,
    sortable: true,
  },
  {
    name: "Longtitude",
    selector: (row) => row.longitude,
    sortable: true,
  },
];

const data = [
  {
    id: 1,
    title: "Beetlejuice",
    year: "1988",
  },
  {
    id: 2,
    title: "Ghostbusters",
    year: "1984",
  },
];

function App() {
  {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [sortColumn, setSortColumn] = useState("");
    const [sortColumnDir, setSortColumnDir] = useState("");
    const [search, setSearch] = useState("");
    const fetchData = async () => {
      setLoading(true);
      var url = `http://localhost:5000/api/attractions?page=${page}&per_page=${perPage}`;
      if (search) {
        url += `&search=${search}`;
      }
      if (sortColumn) {
        url += `&sort_column=${sortColumn}&sort_direction=${sortColumnDir}`;
      }
      const response = await axios.get(url);

      //The below states are for pagination
      //You must set you JSON to have these data available
      setData(response.data.data);
      setTotalRows(response.data.total);
      setLoading(false);
    };
    const handlePageChange = (page: any) => {
      setPage(page);
    };
    const handlePerRowsChange = async (newPerPage: any, page: any) => {
      setPerPage(newPerPage);
      setLoading(false);
    };

    const handleSort = async (column: any, sortDirection: any) => {
      console.log(column.name, sortDirection);
      setSortColumn(column.name);
      setSortColumnDir(sortDirection);
    };
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    };
    const onSearchSubmit = (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault();
      fetchData();
    };
    useEffect(() => {
      fetchData(); // fetch page 1 of users
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, perPage, sortColumn, sortColumnDir]);
    return (
      <div>
        <form onSubmit={onSearchSubmit}>
          <label>
            Search :
            <input type="text" name="search" onChange={handleSearchChange} />
          </label>
          <button type="submit" value="submit">
            Search
          </button>
        </form>
        <DataTable
          title="Attractions"
          columns={columns}
          data={data}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          onSort={handleSort}
        />
      </div>
    );
  }
}

export default App;
