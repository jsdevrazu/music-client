import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUsers } from "../../app/api";
import DashboardNavbar from "../../app/Components/DashboardNavbar/DashboardNavbar";
import Input from "../../app/Components/Input/Input";
import Loader from "../../app/Components/Loader/Loader";
import Meta from "../../app/Components/Meta/Meta";
import DashboardUserCard from "../../app/Components/UserCard";
import { RootState } from "../../app/store";
import { IUser } from "../../app/utils";

const Users = () => {
  const [users, setUsers] = useState<IUser[]>();
  const [filterUser, setFilterUser] = useState<IUser[]>();
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state: RootState) => state.auth);
  const [emailFilter, setEmailFilter] = useState("");

  const getUser = async () => {
    const data = await getUsers(token);
    setLoading(false);
    setUsers(data);
  };

  useEffect(() => {
    if (users && emailFilter?.length > 0) {
      const filtered = users.filter(
        (data) =>
          data.email.includes(emailFilter) ||
          data.name.includes(emailFilter) ||
          data.role.includes(emailFilter)
      );
      setFilterUser(filtered);
    }
  }, [emailFilter]);

  useEffect(() => {
    token && getUser();
  }, [token]);

  return (
    <>
     <Meta title="Music Client - Users" />
      {loading ? (
        <Loader />
      ) : (
        <section className="sec_p">
          <div className="container mx-auto">
            <DashboardNavbar />
            {/* Search Bar */}
            <div className="flex items-center justify-center mt-8">
              <Input
                placeholder="Search..."
                type="text"
                className="border border-1 border-gray-300 p-2 rounded-md outline-none"
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
              />
            </div>
            {/* User List */}
            <div className="relative w-full py-12 min-h-[400px] overflow-x-scroll scrollbar-thin scrollbar-track-slate-300 scrollbar-thumb-slate-400 my-4 flex flex-col items-center justify-start p-4 border border-gray-300 rounded-md gap-3">
              <div className="absolute top-4 left-4">
                <p className="text-xl font-bold">
                  <span className="text-sm font-semibold text-textColor mr-2">
                    Count :
                  </span>
                  {filterUser ? filterUser?.length : users?.length}
                </p>
              </div>

              <div className="w-full min-w-[750px] flex items-center justify-center mt-2">
                {/* prettier-ignore */}
                <p className="table">Image</p>
                {/* prettier-ignore */}
                <p className="table">Name</p>
                {/* prettier-ignore */}
                <p className="table">Email</p>
                {/* prettier-ignore */}
                <p className="table">FormGoogle</p>
                {/* prettier-ignore */}
                <p className="table">Created</p>
                {/* prettier-ignore */}
                <p className="table">Role</p>
              </div>
              {users && !filterUser
                ? users?.map((data) => (
                    <DashboardUserCard data={data} key={data._id} />
                  ))
                : filterUser?.map((data) => (
                    <DashboardUserCard data={data} key={data._id} />
                  ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Users;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (!req.cookies?.token) {
    return {
      redirect: {
        destination: "/login",
      },
      props: { isLogin: false },
    };
  } else
    return {
      props: { isLogin: true },
    };
};
