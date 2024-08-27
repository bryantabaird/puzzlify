import { logout } from "@/server/actions";

const Logout = () => {
  return (
    <form action={logout}>
      <button className="text-white" type="submit">
        Logout
      </button>
    </form>
  );
};

export default Logout;
