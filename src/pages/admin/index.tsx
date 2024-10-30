import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";


const AdminPage = () => {
    return (
        <div>
            <h1>Admin Dashboard - Please Fix later</h1>
            <p>Welcome Admin!</p>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (!session || !session.user.isAdmin) {
        return {
            redirect: {
                destination: '/dashboard',
                permanent: false,
            },
        };
    }
    return {
        props: { session },
    };
};

export default AdminPage