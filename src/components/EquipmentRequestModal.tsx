import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Settings, User, Calendar } from "lucide-react";
import type { Equipment, EquipmentRequestCreateInput } from '@/services/equipmentService';

interface EquipmentRequestModalProps {
  equipment: Equipment;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: EquipmentRequestCreateInput) => Promise<void>;
}

export default function EquipmentRequestModal({
  equipment,
  isOpen,
  onClose,
  onSubmit
}: EquipmentRequestModalProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [purpose, setPurpose] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (quantity <= 0 || quantity > equipment.available_quantity) {
      alert(`Please enter a valid quantity between 1 and ${equipment.available_quantity}`);
      return;
    }
    
    if (!purpose.trim()) {
      alert('Please provide a purpose for this request');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        equipment_id: equipment.id,
        quantity,
        purpose: purpose.trim()
      });
      
      // Reset form
      setQuantity(1);
      setPurpose('');
      onClose();
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setQuantity(1);
    setPurpose('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Request Equipment
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Equipment Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-xl text-gray-900">{equipment.name}</h3>
              <Badge 
                variant={equipment.available_quantity > 0 ? "secondary" : "destructive"}
                className={equipment.available_quantity > 0 
                  ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" 
                  : "bg-red-100 text-red-800 border-red-200"
                }
              >
                {equipment.available_quantity > 0 ? 'Available' : 'Not Available'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="font-medium text-gray-600">Type:</span>
                <div className="text-gray-900 font-medium">{equipment.type}</div>
              </div>
              <div className="space-y-1">
                <span className="font-medium text-gray-600">Available:</span>
                <div className="text-gray-900 font-medium">
                  <span className="text-lg text-blue-600">{equipment.available_quantity}</span>
                  <span className="text-gray-500"> / {equipment.quantity}</span>
                </div>
              </div>
            </div>
            
            {equipment.description && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <span className="font-medium text-gray-600">Description:</span>
                <div className="text-gray-900 text-sm mt-1 leading-relaxed">{equipment.description}</div>
              </div>
            )}
          </div>

          {/* Request Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="w-4 h-4 text-blue-600" />
                Quantity Needed
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={equipment.available_quantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="Enter quantity"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500">
                Maximum available: <span className="font-medium text-blue-600">{equipment.available_quantity}</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 text-blue-600" />
                Purpose / Reason
              </Label>
              <Textarea
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Describe the purpose for this equipment request (e.g., 'Lab experiment for CSE101 course', 'Final year project', etc.)"
                rows={3}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                required
              />
              <p className="text-xs text-gray-500">
                Please provide a clear reason for your request
              </p>
            </div>

            {/* Request Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Request Guidelines:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  Equipment requests require approval from faculty/admin
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  You'll be notified when your request is approved
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  Collect equipment during lab working hours only
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  Return equipment in good condition within the agreed timeframe
                </li>
              </ul>
            </div>

            <DialogFooter className="gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={submitting}
                className="border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || equipment.available_quantity === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
