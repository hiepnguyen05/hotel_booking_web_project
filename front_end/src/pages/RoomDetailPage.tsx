import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoomStore } from '../store/roomStore';
import { useAuthStore } from '../store/authStore';
import { RoomDetail } from '../components/user/RoomDetail';

export function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedRoom, fetchRoomById, isLoading, error } = useRoomStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (id) {
      fetchRoomById(id);
    }
  }, [id, fetchRoomById]);

  const handleBack = () => {
    navigate('/rooms');
  };

  const handleBookNow = (roomId: string) => {
    if (!user) {
      navigate('/login', { state: { from: `/rooms/${roomId}` } });
      return;
    }
    navigate(`/user/booking/${roomId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin phòng...</p>
        </div>
      </div>
    );
  }

  if (error || !selectedRoom) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {error || 'Không tìm thấy phòng'}
          </h2>
          <p className="text-gray-600 mb-4">
            Room ID: {id}
            <br />
            Selected room: {selectedRoom ? 'Yes' : 'No'}
            <br />
            Error: {error}
          </p>
          <button
            onClick={handleBack}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Quay lại danh sách phòng
          </button>
        </div>
      </div>
    );
  }

  // Ensure we have a valid room ID before rendering RoomDetail
  const validRoomId = selectedRoom?.id || selectedRoom?._id || id;
  if (!validRoomId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Không tìm thấy thông tin phòng
          </h2>
          <p className="text-gray-600 mb-4">
            Không thể xác định ID phòng hợp lệ.
          </p>
          <button
            onClick={handleBack}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Quay lại danh sách phòng
          </button>
        </div>
      </div>
    );
  }

  return (
    <RoomDetail
      roomId={validRoomId}
      user={user}
      onBack={handleBack}
      onBookNow={handleBookNow}
    />
  );
}
