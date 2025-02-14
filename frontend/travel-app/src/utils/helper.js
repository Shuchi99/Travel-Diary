import AddStoryImg from '../assets/images/add-story.jpg';
import NoSearchImg from '../assets/images/not-found.jpg';
import NoDateImg from '../assets/images/sad-cal.jpg';

export const validateEmail = (email)=>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const getInitials = (name) => {
    if (!name) return "";

    const words = name.split(" ");
    let initials="";

    for (let i=0; i<Math.min(words.length,2);i++)
    {
        initials+=words[i][0];
    }

    return initials.toUpperCase();
}

export const getEmptyCardMessage = (filterType) => {
    switch (filterType){
        case "search":
            return `Oops! No travel details found your search.`
        case "date":
            return  `No Travels found within the particular date range.`
        default:
            return `To start creating your travel diary click on the add sign on the bottom right of the screen`;
    }
}

export const getEmptyCardImg = (filterType) => {
    switch (filterType){
        case "search":
            return NoSearchImg;
        case "date":
            return NoDateImg;
        default:
            return AddStoryImg;
    }
}