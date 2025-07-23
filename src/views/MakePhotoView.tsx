"use client";

import React, {
  useState,
  useRef,
  useEffect,
  type FormEventHandler,
} from "react";
import {
  Camera,
  Upload,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Download,
  MapPin,
  CreditCard,
  ArrowLeft,
  Eye,
  EyeOff,
  Search,
  X,
  LoaderCircle,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  loadStripe,
  type Stripe,
  type StripeElements,
} from "@stripe/stripe-js";
import {
  allPhotoSpecs,
  copyPhotoSpec,
  specCodeFromString,
  type PhotoSpec,
} from "../models/PhotoSpec";
import { constants } from "../constants";
import { formatPrice } from "../utils/formatPrice";
import { compressImageFile } from "../utils/compressImage";
import { orderRepository } from "../data/OrderRepository";
import BusinessLocationCard from "../components/BusinessLocationCard";
import type { ProductPackage } from "../models/ProductPackage";
import { getIssueMessage } from "../utils/getIssueMessage";
import { idpSaasService } from "../data/network/IdpSaasService";
import type { OrderModel } from "../models/OrderModel";
import NavItem from "../lib/nav-item";
import { computeTotalAndPhotoNumber } from "@/utils/computeTotalAndPhotoNumber";
import ProductPackageCell from "@/components/ProductPackageCell";

interface ApiResponse {
  photoUuid: string;
  idPhotoUrl: string;
  issues?: string[];
  waterMark: boolean;
}

const defaultSpecs: PhotoSpec[] = constants.defaultSpecCodes.map(
  (code) => allPhotoSpecs[code],
);
const defaultProductPackage: ProductPackage = constants.productPackages[1];

function MakePhotoView() {
  const searchParams = useSearchParams();

  const [step, setStep] = useState<"upload" | "purchase">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [processedPhoto, setProcessedPhoto] = useState<ApiResponse | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");
  const [showOriginal, setShowOriginal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState(defaultSpecs[0]);
  const [specOptions, setSpecOptions] = useState([...defaultSpecs]);
  const [selectedPackage, setSelectedPackage] = useState<ProductPackage>(
    defaultProductPackage,
  );
  const [currentOrder, setCurrentOrder] = useState<OrderModel | null>(null);
  const stripeElements = useRef<StripeElements | null>(null);
  const stripe = useRef<Stripe | null>(null);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [additionalPrintedPhotoNumber, setAdditionalPrintedPhotoNumber] =
    useState(0);

  const formattedPrice = formatPrice(
    selectedPackage.priceCents,
    selectedPackage.currency,
  );

  // Filter specs based on search query
  const filteredSpecs = Object.values(allPhotoSpecs).filter(
    (spec) =>
      spec.specCodeInEnglish
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      spec.specCode.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    // Reset processed photo when new file is selected
    setProcessedPhoto(null);
    // Reset show original state
    setShowOriginal(false);

    processPhoto(file);
  };

  const startCamera = async () => {
    // Reset states
    setSelectedFile(null);
    setPreviewUrl("");
    setProcessedPhoto(null);
    setShowOriginal(false);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      setIsUsingCamera(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      setError("Unable to access camera. Please check permissions.");
      console.error(error);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], "camera-photo.jpg", {
                type: "image/jpeg",
              });
              setSelectedFile(file);
              const url = URL.createObjectURL(blob);
              setPreviewUrl(url);
              setProcessedPhoto(null); // Reset processed photo
              setShowOriginal(false); // Reset show original state
              stopCamera();

              processPhoto(file);
            }
          },
          "image/jpeg",
          0.8,
        );
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsUsingCamera(false);
  };

  const processPhoto = async (file: File) => {
    setIsProcessing(true);
    setError("");
    setCurrentOrder(null);

    try {
      const imageDataURL = await compressImageFile(file);

      const order = await orderRepository.createOrder(
        selectedSpec.specCode,
        imageDataURL,
      );

      const result: ApiResponse = {
        photoUuid: order.orderId,
        idPhotoUrl: order.croppedNoBgWatermarkImageUrl ?? "",
        issues: order.issues,
        waterMark: true,
      };
      setProcessedPhoto(result);
      // Reset show original state when new photo is processed
      setShowOriginal(false);

      setCurrentOrder(order);

      await updateStripeForm(
        selectedPackage,
        additionalPrintedPhotoNumber,
        order.orderId,
      );
    } catch (err) {
      setError("Failed to process photo. Please try again.");
      console.error("API Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const goToStep = (targetStep: typeof step) => {
    setStep(targetStep);
    setError("");
  };

  const resetToUpload = () => {
    setStep("upload");
    setProcessedPhoto(null);
    setPreviewUrl("");
    setSelectedFile(null);
    setError("");
    setShowOriginal(false);
  };

  const handleSpecSelect = (spec: PhotoSpec) => {
    setSelectedSpec(spec);
    setShowSearchResults(false);
    setSearchQuery("");

    if (
      specOptions.find((opt) => opt.specCode === spec.specCode) === undefined
    ) {
      const clone = specOptions.map(copyPhotoSpec);
      clone.unshift(copyPhotoSpec(spec));
      setSpecOptions(clone);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(e.target.value.length > 0);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const initStripeForm = async (
    stripe: Stripe,
    amount: number,
    currency: string,
    photoUuid: string,
    printedPhotoNumber: number,
  ) => {
    try {
      // Get clientSecret
      const { clientSecret } = await idpSaasService.createPaymentIntent({
        amountInCent: amount,
        currency,
        photoUuid,
        printedPhotoNumber,
      });

      // Build Stripe form
      stripeElements.current = stripe.elements({
        appearance: { theme: "stripe" },
        clientSecret,
      });

      if (stripeElements.current === null) {
        throw new Error("stripeElements is null");
      }

      const paymentElement = stripeElements.current.create("payment", {
        layout: "tabs",
      });
      paymentElement.mount("#payment-element");
    } catch (error) {
      console.error(error);
    }
  };

  const updateStripeForm = async (
    pkg: ProductPackage,
    additionalPhotoNumber: number,
    orderId: string | undefined = currentOrder?.orderId,
  ) => {
    if (!orderId) {
      console.log("orderId is empty, return");
      return;
    }

    if (!stripe.current) {
      console.log("stripe instance is empty, return");
      return;
    }

    try {
      const { stripeAmount, photoNumber } = computeTotalAndPhotoNumber(
        pkg,
        additionalPhotoNumber,
      );

      await initStripeForm(
        stripe.current,
        stripeAmount,
        pkg.currency,
        orderId,
        photoNumber,
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckoutBtnClick = async (pkg: ProductPackage) => {
    setSelectedPackage(pkg);

    await updateStripeForm(pkg, additionalPrintedPhotoNumber);
  };

  const handleAdditionalPhotoNumberUpdate = async (newVal: number) => {
    if (newVal === additionalPrintedPhotoNumber) {
      console.log("printedPhotoNumber not changed, return");
      return;
    }

    setAdditionalPrintedPhotoNumber(newVal);

    await updateStripeForm(selectedPackage, newVal);
  };

  const handleStripeFormSubmit: FormEventHandler<HTMLFormElement> = async (
    e,
  ) => {
    e.preventDefault();

    try {
      if (!stripe.current || !stripeElements.current) {
        throw new Error("stripe instance or stripeElements is null");
      }

      if (!currentOrder) {
        throw new Error("currentOrder is empty");
      }

      setIsConfirmingPayment(() => true);

      const returnUrl = `${window.location.origin}/orders/${currentOrder.orderId}`;
      const { error } = await stripe.current.confirmPayment({
        elements: stripeElements.current,
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: returnUrl,
        },
      });

      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // redirected to the `return_url`.
      if (error.type === "card_error" || error.type === "validation_error") {
        setPaymentMessage(() => error.message ?? "");
      } else {
        setPaymentMessage(() => "An unexpected error occurred.");
      }

      setIsConfirmingPayment(() => false);
    } catch (error) {
      console.error(error);
      setPaymentMessage(() => "Failed.");
    }
  };

  useEffect(() => {
    const specCodeParam = searchParams.get("specCode");
    if (!specCodeParam) {
      return;
    }

    const specCode = specCodeFromString(specCodeParam);
    if (specCode === undefined) {
      return;
    }

    const spec = allPhotoSpecs[specCode];
    setSelectedSpec(spec);
  }, []);

  useEffect(() => {
    const initStripe = async () => {
      try {
        stripe.current = await loadStripe(constants.stripePublicKey);
        if (stripe.current === null) {
          throw new Error("Create Stripe instance failed");
        }
      } catch (error) {
        console.error(error);
        return;
      }
    };

    initStripe();
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
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Back to Home
            </NavItem>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { key: "upload", label: "Upload & Preview", icon: Upload },
              { key: "purchase", label: "Place Order", icon: CreditCard },
            ].map((stepItem, index) => {
              const StepIcon = stepItem.icon;
              const isActive = step === stepItem.key;
              const isCompleted =
                stepItem.key === "upload" &&
                step === "purchase" &&
                processedPhoto;
              const isClickable =
                stepItem.key === "upload" ||
                (stepItem.key === "purchase" && processedPhoto);

              return (
                <React.Fragment key={stepItem.key}>
                  <button
                    onClick={() =>
                      isClickable && goToStep(stepItem.key as typeof step)
                    }
                    disabled={!isClickable}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : isCompleted
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : isClickable
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <StepIcon className="h-5 w-5" />
                    <span>{stepItem.label}</span>
                  </button>
                  {index < 1 && (
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* How It Works Section - Only show on upload step */}
        {step === "upload" && !processedPhoto && (
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Create Your Passport Photo Online
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Professional passport photos in minutes - guaranteed government
              compliant
            </p>

            {/* Process Steps */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  1. Upload & Preview
                </h3>
                <p className="text-sm text-gray-600">
                  Take or upload a photo, then preview your passport photo
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  2. Place Order
                </h3>
                <p className="text-sm text-gray-600">
                  Choose digital files, prints, or both
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  3. Download/Pickup
                </h3>
                <p className="text-sm text-gray-600">
                  Get digital files instantly or pickup prints
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {step === "upload" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Upload Your Photo
              </h2>

              {/* Photo Spec Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Photo Type:
                </label>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {specOptions.map((spec) => (
                    <div
                      key={spec.specCode}
                      onClick={() => setSelectedSpec(spec)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedSpec.specCode === spec.specCode
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">{`${spec.specCodeInEnglish} Photo`}</span>
                        <span className="text-blue-600 font-bold">
                          {formattedPrice}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Search Other Types */}
                <div className="relative">
                  <div className="flex items-center space-x-2 p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <Search className="h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search for other photo types (e.g., China Visa, UK Passport)..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      className="flex-1 outline-none text-gray-900 placeholder-gray-500"
                    />
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  {showSearchResults && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                      {filteredSpecs.length > 0 ? (
                        filteredSpecs.slice(0, 10).map((spec) => (
                          <button
                            key={spec.specCode}
                            onClick={() => handleSpecSelect(spec)}
                            className="w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-900">{`${spec.specCodeInEnglish} Photo`}</span>
                              <span className="text-blue-600 font-bold">
                                {formattedPrice}
                              </span>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-gray-500 text-center">
                          No photo types found matching "{searchQuery}"
                        </div>
                      )}
                      {filteredSpecs.length > 10 && (
                        <div className="p-3 text-gray-500 text-center text-sm border-t border-gray-100">
                          Showing first 10 results. Refine your search for more
                          specific results.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Spec Display */}
                {selectedSpec && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-800">
                        <strong>Selected:</strong>{" "}
                        {selectedSpec.specCodeInEnglish}
                      </span>
                      <span className="text-blue-600 font-bold">
                        {formattedPrice}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Section - Shows both original and processed if available */}
              {previewUrl && (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Preview:
                  </h3>

                  {processedPhoto ? (
                    // Show processed photo by default, original only when requested
                    <div className="space-y-6">
                      {/* Main photo display */}
                      <div className="text-center">
                        {showOriginal ? (
                          <div className="flex flex-col items-center">
                            <h4 className="font-medium text-gray-700 mb-3 text-center">
                              Original Photo
                            </h4>
                            <div className="flex justify-center max-w-xs">
                              <img
                                src={previewUrl}
                                alt="Original"
                                className="rounded-lg shadow-md"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <h4 className="font-medium text-gray-700 mb-3 text-center">
                              Passport Photo
                            </h4>
                            <div className="flex justify-center max-w-xs">
                              <img
                                src={processedPhoto.idPhotoUrl}
                                alt="Processed"
                                className="rounded-lg shadow-md"
                              />
                            </div>
                            {processedPhoto.waterMark && (
                              <p className="text-sm text-gray-600 mt-2">
                                * Watermark will be removed after purchase
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Toggle button */}
                      <div className="text-center">
                        <button
                          onClick={() => setShowOriginal(!showOriginal)}
                          className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors underline"
                        >
                          {showOriginal ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span>
                            {showOriginal
                              ? "Show passport photo"
                              : "Show original photo"}
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Show only original photo with process button
                    <div className="flex flex-col items-center">
                      <div className="flex justify-center max-w-xs">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="rounded-lg shadow-md mb-4"
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (!selectedFile) {
                            return;
                          }
                          processPhoto(selectedFile);
                        }}
                        disabled={isProcessing}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <span>Create Passport Photo</span>
                            <ArrowRight className="h-5 w-5" />
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Photo Quality Issues */}
                  {processedPhoto?.issues &&
                    processedPhoto.issues.length > 0 && (
                      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-800">
                              We found some issues:
                            </h4>
                            <ul className="mt-2 space-y-1">
                              {processedPhoto.issues.map((issue, index) => (
                                <li
                                  key={index}
                                  className="text-yellow-700 text-sm"
                                >
                                  • {getIssueMessage(issue)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Action buttons when processed photo is ready */}
                  {processedPhoto && (
                    <div className="mt-6 flex flex-col md:flex-row justify-center gap-4">
                      <button
                        onClick={() => setStep("purchase")}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        I Like It - Place Order
                      </button>
                      <button
                        onClick={resetToUpload}
                        className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                      >
                        Retake Photo
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Upload Options - Only show if no photo selected */}
              <div className={`${!previewUrl ? "" : "hidden"} space-y-4`}>
                {!isUsingCamera ? (
                  <>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Upload a Photo
                      </p>
                      <p className="text-gray-600 mb-4">
                        Choose a photo from your device
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Choose File
                      </button>
                    </div>

                    <div className="text-center">
                      <span className="text-gray-500">or</span>
                    </div>

                    <div className="text-center">
                      <button
                        onClick={startCamera}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
                      >
                        <Camera className="h-5 w-5" />
                        <span>Take Photo with Camera</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                <div className={`${isUsingCamera ? "" : "hidden"} text-center`}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full max-w-md mx-auto rounded-lg mb-4"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="space-x-4">
                    <button
                      onClick={capturePhoto}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Capture Photo
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              {/* Upload Options - Show if photo selected but want to change */}
              <div
                className={`${previewUrl && !processedPhoto ? "" : "hidden"} mt-6 text-center`}
              >
                <p className="text-gray-600 mb-4">
                  Want to use a different photo?
                </p>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Choose Different File
                  </button>
                  <button
                    onClick={startCamera}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Use Camera
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-red-700">{error}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div
            className={step === "purchase" && processedPhoto ? "" : "hidden"}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Place Your Order
              </h2>
              <button
                onClick={() => goToStep("upload")}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Upload</span>
              </button>
            </div>

            {/* Photo Preview in Purchase Step */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Passport Photo:
              </h3>
              <div className="space-y-6">
                {/* Main photo display */}
                <div className="text-center">
                  {showOriginal ? (
                    <div className="flex flex-col items-center">
                      <h4 className="font-medium text-gray-700 mb-3 text-center">
                        Original Photo
                      </h4>
                      <div className="flex justify-center max-w-xs">
                        <img
                          src={previewUrl}
                          alt="Original"
                          className="rounded-lg shadow-md"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <h4 className="font-medium text-gray-700 mb-3 text-center">
                        Passport Photo
                      </h4>
                      <div className="flex justify-center max-w-xs">
                        {processedPhoto?.idPhotoUrl ? (
                          <img
                            src={processedPhoto.idPhotoUrl}
                            alt="Processed"
                            className="rounded-lg shadow-md"
                          />
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>

                {/* Toggle button */}
                <div className="text-center">
                  <button
                    onClick={() => setShowOriginal(!showOriginal)}
                    className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors underline"
                  >
                    {showOriginal ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span>
                      {showOriginal
                        ? "Show passport photo"
                        : "Show original photo"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Purchase Options */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {constants.productPackages.map((pkg) => (
                <ProductPackageCell
                  key={pkg.id}
                  pkg={pkg}
                  isSelected={selectedPackage.id === pkg.id}
                  additionalPhotoNumber={additionalPrintedPhotoNumber}
                  onBuyClick={(it) => handleCheckoutBtnClick(it)}
                  onAdditionalPhotoNumberUpdate={(v) =>
                    handleAdditionalPhotoNumberUpdate(v)
                  }
                />
              ))}
            </div>

            {constants.stripePublicKey.startsWith("pk_test") ? (
              <p className="text-sm text-gray-600 pb-6">
                You are using stripe test key. In test mode, you can use card
                number 4242 4242 4242 4242 to test payment. Note: Use future
                date as an Expiration Date
              </p>
            ) : (
              <></>
            )}

            <form
              id="payment-form"
              className="pb-4"
              onSubmit={handleStripeFormSubmit}
            >
              <div id="payment-element"></div>
              <div className="pt-4">
                <button
                  id="submit"
                  disabled={isConfirmingPayment}
                  className="w-full px-4 py-2.5 flex justify-center items-center gap-2 rounded-lg fw-500 text-4 text-on-primary bg-primary hover:op-90 transition"
                >
                  {isConfirmingPayment ? (
                    <LoaderCircle className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <></>
                  )}
                  <span id="button-text" className="text-white fw-600">
                    Pay
                  </span>
                </button>
              </div>
              <p className="pt-2 text-center text-sm text-secondary-text">
                {paymentMessage}
              </p>
            </form>

            {selectedPackage.isPickUp ? (
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>Pickup Locations for Printed Photos</span>
                </h4>
                <div className="flex justify-center">
                  {constants.businessLocations.map((loc) => (
                    <BusinessLocationCard key={loc.address} location={loc} />
                  ))}
                </div>
              </div>
            ) : (
              <></>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MakePhotoView;
