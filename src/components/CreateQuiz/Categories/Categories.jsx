import { useState, useEffect } from "react";
import { FormLabel } from "@chakra-ui/react";
import PropTypes from "prop-types";


const Categories = ({ onSelectCategory }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://opentdb.com/api_category.php")
            .then((response) => response.json())
            .then((data) => {
                setCategories(data.trivia_categories); 
                setLoading(false);
            });
    }, []);
    

    const handleCategoryChange = (e) => {
        const selectedCategory = categories.find(cat => cat.id.toString() === e.target.value);
        onSelectCategory(selectedCategory || {});
    };

    if (loading) return <p>Loading categories...</p>;

    return (
        <FormLabel htmlFor="quizCategory" color={"white"} > 
        Categories <br/>  
        <select onChange={handleCategoryChange}>
            <option value="">Select category</option>
            {categories.map((category) => {
    return (
        <option key={category.id} value={category.id}>
            {category.name}
        </option>
    );
})}
        </select>
        </FormLabel>
    );

}

Categories.propTypes = {
    onSelectCategory: PropTypes.func.isRequired,
};

export default Categories;
