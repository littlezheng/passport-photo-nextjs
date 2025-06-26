export async function downloadFile(imageUrl: string, label: string) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = label;

  document.body.appendChild(a);
  a.click();

  a.parentNode?.removeChild(a);
}
