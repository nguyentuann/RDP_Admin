// URL gốc API
const apiUrl = `http://10.10.27.154:8088/rdp/api/v1/`;

// Hàm đăng nhập
async function login(username, password, table) {
    try {
        const response = await fetch(`${apiUrl}${table}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(errorDetails.message || 'Đăng nhập thất bại');
        }

        const responseData = await response.json();
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
    console.log(token)
    if (!token) {
        console.error('Không tìm thấy token để đăng xuất');
        return null;
    }

    try {
        const response = await fetch(`${apiUrl}${table}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({token})
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(errorDetails.message || 'Đăng xuất thất bại');
        }

        const responseData = await response.json();
        console.log('Phản hồi từ server:', responseData);
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

        const response = await fetch(`${apiUrl}${table}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Không thể lấy dữ liệu từ API');
        }

        const data = await response.json();
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

        const response = await fetch(`${apiUrl}${table}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newData)
        });

        if (!response.ok) {
            throw new Error('Không thể thêm dữ liệu');
        }

        const data = await response.json();
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

        const response = await fetch(`${apiUrl}${table}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error('Không thể cập nhật dữ liệu');
        }

        const data = await response.json();
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

        const response = await fetch(`${apiUrl}${table}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'  // Thêm header Content-Type nếu cần
            }
        });

        if (!response.ok) {
            const errorData = await response.json(); // Lấy chi tiết lỗi nếu có
            throw new Error(errorData.message || 'Không thể xóa dữ liệu');
        }

        console.log('Xóa dữ liệu thành công');
        return true;
    } catch (error) {
        console.error('Lỗi:', error.message);
        return false;
    }
}

const allApi = {
    login,
    logout,
    fetchData,
    addData,
    updateData,
    deleteData
};
