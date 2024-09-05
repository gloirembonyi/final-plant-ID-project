const fetchPlants = async () => {
    const res = await fetch('/api/plants');
    const data = await res.json();
    return data;
};
