"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Download,
  Camera,
  LoaderCircle,
  CircleAlert,
  CheckCircle,
  Clock,
  CreditCard,
  User,
  Calendar,
  Package,
} from "lucide-react";
import { constants } from "../constants";
import { useEffect, useRef, useState } from "react";
import type { OrderModel } from "../models/OrderModel";
import { orderRepository } from "../data/OrderRepository";
import { formatPrice } from "../utils/formatPrice";
import { allPhotoSpecs, specCodeFromString } from "../models/PhotoSpec";
import type { AsyncReqState } from "../models/AsyncReqState";
import { downloadFile } from "../utils/downloadFile";
import OrderStatusTag from "../components/OrderStatusTag";
import BusinessLocationCard from "../components/BusinessLocationCard";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import NavItem from "../lib/nav-item";

export default function OrderDetailView() {
  const params = useParams();
  const [order, setOrder] = useState<OrderModel | undefined>();
  const [getOrderState, setGetOrderState] = useState<AsyncReqState>("idle");
  const [saveImageState, setSaveImageState] = useState<AsyncReqState>("idle");
  const stripe = useRef<Stripe | null>(null);
  const [paymentMessage, setPaymentMessage] = useState("");

  const orderId = `${params.orderId}`;

  const formattedSubtotal =
    order?.orderAmountInCents && order?.orderCurrency
      ? formatPrice(order?.orderAmountInCents, order?.orderCurrency)
      : "";
  const formattedTotal =
    order?.orderAmountInCents && order?.orderCurrency
      ? formatPrice(order?.orderAmountInCents, order?.orderCurrency)
      : "";

  const photoSpec = (() => {
    const specCodeStr = order?.specCode;
    if (!specCodeStr) {
      return undefined;
    }

    const specCode = specCodeFromString(specCodeStr);
    if (!specCode) {
      return undefined;
    }

    return allPhotoSpecs[specCode];
  })();

  const handleSavePhotoClick = async () => {
    const imageUrl = order?.croppedNoBgNoWatermarkImageUrl;
    if (!imageUrl) {
      return;
    }

    const filename = `${order?.orderId ?? "ID Photo"}.jpeg`;
    try {
      setSaveImageState(() => "loading");

      await downloadFile(imageUrl, filename);

      setSaveImageState(() => "success");
    } catch (error) {
      console.error(error);
      setSaveImageState(() => "failed");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setGetOrderState(() => "loading");

        const url = new URL(window.location.href);
        const paymentIntentId = url.searchParams.get("payment_intent");
        if (!paymentIntentId) {
          throw new Error("paymentIntentId not exist");
        }
        const cleanUrl = `${url.origin}${url.pathname}?payment_intent=${paymentIntentId}`;
        window.history.replaceState({}, document.title, cleanUrl);

        const orderData = await orderRepository.getOrder(
          orderId,
          paymentIntentId,
        );
        const paymentStatus = orderData.paymentStatus;

        stripe.current = await loadStripe(constants.stripePublicKey);
        if (stripe.current === null) {
          throw new Error("Create Stripe instance failed");
        }

        if (paymentStatus === "succeeded") {
          setOrder(orderData);
        } else if (paymentStatus === "processing") {
          const order: OrderModel = {
            orderId,
            specCode: "",
            status: "ORDER_PROCESSING",
            issues: [],
          };
          setOrder(order);
        } else if (paymentStatus === "requires_payment_method") {
          setPaymentMessage(() => "Payment not success");
        } else {
          setPaymentMessage(() => "An unexpected error occurred.");
        }

        setGetOrderState(() => "success");
      } catch (error) {
        console.error(error);
        setGetOrderState(() => "failed");
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <NavItem href="/">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {constants.studioName}
                </span>
              </div>
            </NavItem>

            <NavItem
              href="/"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Back to Home
            </NavItem>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order Details
              </h1>
              <p className="text-gray-600">Order ID: {orderId}</p>
            </div>
            {order?.status && <OrderStatusTag status={order.status} />}
          </div>
        </div>

        {getOrderState === "failed" ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <CircleAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Failed to Load Order
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't retrieve your order details. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Photo Preview Card */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Your Passport Photo
                </h2>

                <div className="flex flex-col gap-4 items-center">
                  {paymentMessage ? (
                    <p className="text-center">{paymentMessage}</p>
                  ) : (
                    <></>
                  )}

                  <div className="max-w-xs inline-block bg-gray-50 rounded-lg p-6">
                    {getOrderState === "loading" ? (
                      <div className="w-64 h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                        <LoaderCircle className="h-8 w-8 animate-spin text-gray-500" />
                      </div>
                    ) : order?.croppedNoBgNoWatermarkImageUrl ? (
                      <img
                        src={order.croppedNoBgNoWatermarkImageUrl}
                        alt="Passport photo"
                        className="rounded-lg shadow-md"
                      />
                    ) : (
                      <div className="w-64 h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Camera className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <button
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center space-x-2"
                    disabled={
                      !order?.croppedNoBgNoWatermarkImageUrl ||
                      saveImageState === "loading"
                    }
                    onClick={handleSavePhotoClick}
                  >
                    {saveImageState === "failed" ? (
                      <>
                        <CircleAlert className="h-5 w-5" />
                        <span>Download Failed</span>
                      </>
                    ) : saveImageState === "loading" ? (
                      <>
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                        <span>Downloading...</span>
                      </>
                    ) : saveImageState === "success" ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <span>Downloaded</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5" />
                        <span>Download Photo</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Photo Details Card */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Photo Specifications
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Photo Type</p>
                        {getOrderState === "loading" ? (
                          <LoaderCircle className="h-4 w-4 animate-spin text-gray-500" />
                        ) : (
                          <p className="text-gray-600">
                            {photoSpec?.specCodeInEnglish || "N/A"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Dimensions</p>
                        {getOrderState === "loading" ? (
                          <LoaderCircle className="h-4 w-4 animate-spin text-gray-500" />
                        ) : (
                          <p className="text-gray-600">
                            {photoSpec
                              ? `${photoSpec.widthUnit}x${photoSpec.heightUnit}${photoSpec.unit}`
                              : "N/A"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Camera className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Resolution</p>
                        {getOrderState === "loading" ? (
                          <LoaderCircle className="h-4 w-4 animate-spin text-gray-500" />
                        ) : (
                          <p className="text-gray-600">
                            {photoSpec
                              ? `${photoSpec.widthPx}x${photoSpec.heightPx}px`
                              : "N/A"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Compliance</p>
                        <p className="text-gray-600">Government Approved</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Order Summary Card */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  {order?.productName && (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.productName}
                        </p>
                        {order.productDescription && (
                          <p className="text-sm text-gray-600">
                            {order.productDescription}
                          </p>
                        )}
                      </div>
                      {getOrderState === "loading" ? (
                        <LoaderCircle className="h-4 w-4 animate-spin text-gray-500" />
                      ) : (
                        <p className="font-semibold text-gray-900">
                          {formattedSubtotal}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold text-gray-900">
                        Total
                      </p>
                      {getOrderState === "loading" ? (
                        <LoaderCircle className="h-4 w-4 animate-spin text-gray-500" />
                      ) : (
                        <p className="text-lg font-bold text-blue-600">
                          {formattedTotal}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                {order?.paymentMethod && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <p className="font-medium text-gray-900">
                        Payment Method
                      </p>
                    </div>
                    <p className="text-gray-600 ml-8">{order.paymentMethod}</p>

                    {order.paymentTransactionId && (
                      <p className="text-sm text-gray-500 ml-8 mt-1">
                        Transaction: {order.paymentTransactionId}
                      </p>
                    )}
                  </div>
                )}

                {/* Order Date */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Order Date</p>
                      <p className="text-gray-600">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Card */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Order Status
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Photo Processed
                      </p>
                      <p className="text-sm text-gray-600">
                        Your photo has been created
                      </p>
                    </div>
                  </div>

                  {order?.status === "ORDER_EFFECTIVELY" && (
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Payment Confirmed
                        </p>
                        <p className="text-sm text-gray-600">
                          Ready for download
                        </p>
                      </div>
                    </div>
                  )}

                  {order?.status === "ORDER_PROCESSING" && (
                    <div className="flex items-center space-x-3">
                      <div className="bg-yellow-100 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Processing Payment
                        </p>
                        <p className="text-sm text-gray-600">
                          Please wait while we process your payment
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Need Help Card */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  If you have any questions about your order, feel free to
                  contact us.
                </p>
                <div className="space-y-2 text-sm">
                  {constants.businessLocations.map((loc) => (
                    <div key={loc.address}>
                      <p className="font-medium text-gray-900">Location</p>
                      {loc.phone && (
                        <p className="text-gray-600">{loc.phone}</p>
                      )}
                      {loc.email && (
                        <p className="text-gray-600">{loc.email}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pickup Locations - Only show if order includes prints */}
        {order?.productName?.toLowerCase().includes("print") && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Pickup Locations
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {constants.businessLocations.map((loc) => (
                <BusinessLocationCard key={loc.address} location={loc} />
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <NavItem
            href={
              photoSpec?.specCode
                ? `/make-photo?specCode=${photoSpec.specCode}`
                : "/make-photo"
            }
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
          >
            Create Another Photo
          </NavItem>
          <NavItem
            href="/"
            className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-center"
          >
            Back to Home
          </NavItem>
        </div>
      </div>
    </div>
  );
}
