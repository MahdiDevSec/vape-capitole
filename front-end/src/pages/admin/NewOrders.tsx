import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaSearch, FaFilter } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';

interface Order {
  _id: string;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
  };
  products: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
      image?: string;
    };
    quantity: number;
    price: number;
    name: string;
    image?: string;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentInfo?: {
    cardholderName: string;
    cardLastFour: string;
    expiryDate: string;
  };
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
}

const NewAdminOrders = () => {
  const { language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrders(currentPage, 10, statusFilter);
      setOrders(response.orders);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      await updateOrderStatus(selectedOrder._id, editStatus);
      fetchOrders();
      setIsEditing(false);
      setSelectedOrder(null);
      alert(language === 'ar' ? 'تم تحديث حالة الطلب بنجاح' : 'Order status updated successfully');
    } catch (error: any) {
      console.error('Error updating order:', error);
      alert(language === 'ar' ? 'حدث خطأ في تحديث الطلب' : 'Error updating order');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">
          {language === 'ar' ? 'إدارة الطلبات' : 'Orders Management'}
        </h1>
        
        {/* Status Filter */}
        <div className="flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">{language === 'ar' ? 'جميع الطلبات' : 'All Orders'}</option>
            <option value="pending">{language === 'ar' ? 'قيد الانتظار' : 'Pending'}</option>
            <option value="processing">{language === 'ar' ? 'قيد المعالجة' : 'Processing'}</option>
            <option value="shipped">{language === 'ar' ? 'تم الشحن' : 'Shipped'}</option>
            <option value="delivered">{language === 'ar' ? 'تم التسليم' : 'Delivered'}</option>
            <option value="cancelled">{language === 'ar' ? 'ملغي' : 'Cancelled'}</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'ar' ? 'رقم الطلب' : 'Order ID'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'ar' ? 'العميل' : 'Customer'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'ar' ? 'المجموع' : 'Total'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'ar' ? 'الدفع' : 'Payment'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'ar' ? 'التاريخ' : 'Date'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    #{order._id.slice(-6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.customerInfo.fullName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.customerInfo.email}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.customerInfo.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {language === 'ar' ? (
                        order.status === 'pending' ? 'قيد الانتظار' :
                        order.status === 'processing' ? 'قيد المعالجة' :
                        order.status === 'shipped' ? 'تم الشحن' :
                        order.status === 'delivered' ? 'تم التسليم' :
                        order.status === 'cancelled' ? 'ملغي' : order.status
                      ) : order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(order)}
                      className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-4"
                      title={language === 'ar' ? 'تحديث الحالة' : 'Update Status'}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-green-600 hover:text-green-900 dark:hover:text-green-400"
                      title={language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {isEditing && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              {language === 'ar' ? 'تحديث حالة الطلب' : 'Update Order Status'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">
                  {language === 'ar' ? 'الحالة' : 'Status'}
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 dark:bg-gray-700 dark:text-white"
                >
                  <option value="pending">{language === 'ar' ? 'قيد الانتظار' : 'Pending'}</option>
                  <option value="processing">{language === 'ar' ? 'قيد المعالجة' : 'Processing'}</option>
                  <option value="shipped">{language === 'ar' ? 'تم الشحن' : 'Shipped'}</option>
                  <option value="delivered">{language === 'ar' ? 'تم التسليم' : 'Delivered'}</option>
                  <option value="cancelled">{language === 'ar' ? 'ملغي' : 'Cancelled'}</option>
                </select>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedOrder(null);
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
                >
                  {language === 'ar' ? 'تحديث' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && !isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              {language === 'ar' ? 'تفاصيل الطلب' : 'Order Details'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div>
                <h3 className="font-medium mb-2 dark:text-white">
                  {language === 'ar' ? 'معلومات العميل' : 'Customer Information'}
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="dark:text-gray-300"><strong>{language === 'ar' ? 'الاسم:' : 'Name:'}</strong> {selectedOrder.customerInfo.fullName}</p>
                  <p className="dark:text-gray-300"><strong>{language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}</strong> {selectedOrder.customerInfo.email}</p>
                  <p className="dark:text-gray-300"><strong>{language === 'ar' ? 'الهاتف:' : 'Phone:'}</strong> {selectedOrder.customerInfo.phone}</p>
                  <p className="dark:text-gray-300"><strong>{language === 'ar' ? 'العنوان:' : 'Address:'}</strong> {selectedOrder.customerInfo.address}</p>
                  <p className="dark:text-gray-300"><strong>{language === 'ar' ? 'المدينة:' : 'City:'}</strong> {selectedOrder.customerInfo.city}</p>
                  {selectedOrder.customerInfo.postalCode && (
                    <p className="dark:text-gray-300"><strong>{language === 'ar' ? 'الرمز البريدي:' : 'Postal Code:'}</strong> {selectedOrder.customerInfo.postalCode}</p>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="font-medium mb-2 dark:text-white">
                  {language === 'ar' ? 'معلومات الدفع' : 'Payment Information'}
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="dark:text-gray-300"><strong>{language === 'ar' ? 'طريقة الدفع:' : 'Payment Method:'}</strong> {selectedOrder.paymentMethod}</p>
                  {selectedOrder.paymentInfo && (
                    <>
                      <p className="dark:text-gray-300"><strong>{language === 'ar' ? 'حامل البطاقة:' : 'Cardholder:'}</strong> {selectedOrder.paymentInfo.cardholderName}</p>
                      <p className="dark:text-gray-300"><strong>{language === 'ar' ? 'آخر 4 أرقام:' : 'Last 4 digits:'}</strong> **** {selectedOrder.paymentInfo.cardLastFour}</p>
                      <p className="dark:text-gray-300"><strong>{language === 'ar' ? 'تاريخ الانتهاء:' : 'Expiry:'}</strong> {selectedOrder.paymentInfo.expiryDate}</p>
                    </>
                  )}
                  <p className="dark:text-gray-300">
                    <strong>{language === 'ar' ? 'حالة الدفع:' : 'Payment Status:'}</strong> 
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="mt-6">
              <h3 className="font-medium mb-2 dark:text-white">
                {language === 'ar' ? 'المنتجات' : 'Products'}
              </h3>
              <div className="space-y-2">
                {selectedOrder.products.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <span className="font-medium dark:text-white">{item.name}</span>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {language === 'ar' ? 'الكمية:' : 'Quantity:'} {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-medium dark:text-white">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 mt-4">
                <div className="flex justify-between font-bold text-lg dark:text-white">
                  <span>{language === 'ar' ? 'المجموع:' : 'Total:'}</span>
                  <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="mt-6">
              <h3 className="font-medium mb-2 dark:text-white">
                {language === 'ar' ? 'معلومات الطلب' : 'Order Information'}
              </h3>
              <div className="space-y-1 text-sm">
                <p className="dark:text-gray-300">
                  <strong>{language === 'ar' ? 'الحالة:' : 'Status:'}</strong> 
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {language === 'ar' ? (
                      selectedOrder.status === 'pending' ? 'قيد الانتظار' :
                      selectedOrder.status === 'processing' ? 'قيد المعالجة' :
                      selectedOrder.status === 'shipped' ? 'تم الشحن' :
                      selectedOrder.status === 'delivered' ? 'تم التسليم' :
                      selectedOrder.status === 'cancelled' ? 'ملغي' : selectedOrder.status
                    ) : selectedOrder.status}
                  </span>
                </p>
                <p className="dark:text-gray-300"><strong>{language === 'ar' ? 'تاريخ الطلب:' : 'Order Date:'}</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                <p className="dark:text-gray-300"><strong>{language === 'ar' ? 'آخر تحديث:' : 'Last Updated:'}</strong> {new Date(selectedOrder.updatedAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewAdminOrders;
