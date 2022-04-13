var math = {};

math.diffInYearsFromToday = (dateString) => {
    var today = new Date();
    if(!dateString) return 0;
    var birthDate = new Date(dateString);
    var years = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        years--;
    }
    return years;
};

math.getTimeStampDate = () => {
    let today = new Date();
    today = convertTZ(today, "America/Buenos_Aires");

    return `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
};

function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("es-AR", {timeZone: tzString}));   
}

module.exports = math;