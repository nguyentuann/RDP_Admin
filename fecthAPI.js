

const ipServer = 'http://10.10.49.124:8088/';

async function fetchAPI(endpoint, options) {
    const url = `${ipServer}${endpoint}`;
    let response;
    try {
        response = await fetch(url, options);

    }
    catch (error) {
        throw new Error("Lỗi khi làm việc với server!")
    }

    if (!response.ok) {
        console.log("Error"+response.status)
        let errorMessage = '';
        switch (response.status) {
            case 401:
                errorMessage = 'Lỗi Xác Thực!';
                break;
            case 403:
                errorMessage = 'Bạn không có quyền truy cập!';
                break;
            case 404:
                errorMessage = 'Không tìm thấy thông tin server!';
                break;
            default:
                errorMessage = 'Lỗi khi làm việc với server!';
        }

        const error = new Error(errorMessage);
        error.status = response.status;
        throw error;
    }

    return response.json();
}


// Hàm đăng nhập
async function login(username, password, table) {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        };
        const responseData = await fetchAPI(`${table}`, options);
        const token = responseData?.data?.token;
        if (!token) {
            throw new Error('Token không tồn tại trong phản hồi từ server');
        }
        localStorage.setItem('jwtToken', token);
        return responseData;
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error.message);
        return null;
    }
}

// Hàm đăng xuất
async function logout(table) {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        console.error('Không tìm thấy token để đăng xuất');
        return null;
    }

    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({token})
        };
        const responseData = await fetchAPI(`${table}`, options);
        localStorage.removeItem('jwtToken');
        return responseData;
    } catch (error) {
        console.error('Lỗi khi đăng xuất:', error.message);
        return null;
    }
}

// Hàm lấy dữ liệu
async function fetchData(table) {
    try {
        const token = localStorage.getItem('jwtToken');
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        const data = await fetchAPI(`${table}`, options);
        return data;
    } catch (error) {
        console.error('Lỗi:', error.message);
        return null;
    }
}

// Hàm thêm dữ liệu
async function addData(table, newData) {
    try {
        const token = localStorage.getItem('jwtToken');
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newData)
        };
        const data = await fetchAPI(`${table}`, options);
        return data;
    } catch (error) {
        console.error('Lỗi:', error.message);
        return null;
    }
}

// Hàm cập nhật dữ liệu
async function updateData(table, id, updatedData) {
    try {
        const token = localStorage.getItem('jwtToken');
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedData)
        };
        const data = await fetchAPI(`${table}/${id}`, options);
        return data;
    } catch (error) {
        console.error('Lỗi:', error.message);
        return null;
    }
}

// Hàm xóa dữ liệu
async function deleteData(table, id) {
    try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            throw new Error('Token không hợp lệ');
        }

        const options = {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        const responseData = await fetchAPI(`${table}/${id}`, options);
        console.log('Xóa dữ liệu thành công');
        return responseData;
    } catch (error) {
        console.error('Lỗi:', error.message);
        return false;
    }
}

const allApi  = {
    login,
    logout,
    fetchData,
    addData,
    updateData,
    deleteData
};
