import {Link} from "react-router-dom";
const NotFound = () => {
    return (
        <div>
            <h1>404 Not Found</h1>
            <Link to="/">Go back to Homepage</Link>

        </div>
    );
}

export default NotFound;