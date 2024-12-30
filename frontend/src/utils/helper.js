import ADD_STORY_IMG from '../assets/images/add-story.svg'
import NO_SEARCH_DATA_IMG from '../assets/images/no-search-data.svg'
import NO_Filter_DATA_IMG from '../assets/images/no-filter-data.svg'
export const validateEmail=(email)=>{
    const regex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email)
}

export const getInitials=(Name)=>{
    if(!Name) return "";
    const words = Name.split(" ");
    let initials =" ";
    for (let i = 0; i<Math.min(words.length,2); i++) {
        initials +=words[i][0];
    }
    return initials.toUpperCase()
}
export const getEmptyCardMessage=(filterType)=>{
    switch(filterType){
        case "search":
            return `Oops! No stories found matching your search.`;
        case "date":
            return `Oops! No stories found matching your search.`;
        default:
            return `Start creating your first travel story! Click the 'ADD' button to jot down thoughts, ideas, and memories. Let's get started!`
    }
}

export const getEmptyCardImg=(filterType)=>{
    switch(filterType){
        case "search":
            return NO_SEARCH_DATA_IMG;
        case "date":
            return NO_Filter_DATA_IMG
        default:
            return ADD_STORY_IMG
    }
}