async function test() {
    try {
        console.log('Registering...');
        const uniqueEmail = `test_${Date.now()}@example.com`;
        let registerRes = await fetch('http://localhost:8080/hotel-booking/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: uniqueEmail, password: 'password', fullName: 'Tester', phone: '0123456789' })
        });
        
        const registerData = await registerRes.json();
        if (!registerRes.ok) {
             console.log('Register fail:', registerData);
             return;
        }
        console.log('Registered!');

        console.log('Logging in...');
        let loginRes = await fetch('http://localhost:8080/hotel-booking/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: uniqueEmail, password: 'password' })
        });
        let loginData = await loginRes.json();
        
        const token = loginData.data.token;
        console.log('Got token');

        // 2. Fetch rooms
        const roomsRes = await fetch('http://localhost:8080/hotel-booking/api/rooms');
        const roomsData = await roomsRes.json();
        const roomId = roomsData.data[0].id;
        console.log('Got room id:', roomId);

        // 3. Create booking
        console.log('Creating booking...');
        const bookingReq = {
            roomId: roomId,
            checkIn: '2026-08-01',
            checkOut: '2026-08-02',
            capacity: 1,
            customer: {
                fullName: 'Test User',
                email: 'test@example.com',
                phone: '0900000000'
            },
            paymentMethod: 'cash',
            requests: '',
            status: 'APPROVED'
        };

        const bookingRes = await fetch('http://localhost:8080/hotel-booking/api/bookings', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(bookingReq)
        });
        
        const bookingData = await bookingRes.json().catch(() => null);
        
        if (!bookingRes.ok) {
            console.log('ERROR:', bookingRes.status);
            console.log('ERROR DATA:', JSON.stringify(bookingData, null, 2));
        } else {
            console.log('Booking success:', bookingData);
        }

    } catch (error) {
        console.log('Exception:', error);
    }
}

test();
