import { useLocation } from "@react-navigation/native";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <View >
      <View >
        <Text style={styles.title}>404</Text>
        <Text>Oops! Page not found</Text>
        <a href="/" >
          Return to Home
        </a>
      </View>
    </View>
  );
};

export default NotFound;
